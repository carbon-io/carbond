const oo = require('@carbon-io/carbon-core').atom.oo(module)
const  _ = require('lodash')

/******************************************************************************
 * @interface RequestLogger
 */
const RequestLogger = oo({
    _ctorName: 'RequestLogger',
    _C: function() {
        if (this.constructor === RequestLogger)
            throw new Error('Interface')
    },

    /**********************************************************************
     * method _wrapResponseSetHeader
     *
     * Wraps an Express.js Response object's setHeader() method
     * in order to retain the response headers after the response has been
     * sent.
     * 
     * The headers are available in the Response object's `sent.headers`
     * property.
     * 
     * @param {Express.Response} res - an Express.js Response object
     */
    _wrapResponseSetHeader: function(res) {
        const res_methods = {
            setHeader: res.setHeader
        }

        res.setHeader = function(name, value) {
            if (!res.sent)
                res.sent = { }
            if (!res.sent.headers)
                res.sent.headers = { }

            res.sent.headers[name] = value

            res_methods.setHeader.apply(res, arguments)
        }
    },

    /**********************************************************************
     * method _wrapResponseWriteAndEnd
     *
     * Wraps an Express.js Response object's write() and end() methods
     * in order to retain the response body after the response has been
     * sent.
     * 
     * The response body is available in the Response object's `sent.body`
     * property.
     * 
     * @param {Express.Response} res - an Express.js Response object
     */
    _wrapResponseWriteAndEnd: function(res) {
        const chunks = []

        const res_methods = {
            write: res.write,
            end: res.end
        }

        res.write = function(chunk) {
            chunks.push(chunk)

            res_methods.write.apply(res, arguments)
        }
        res.end = function(chunk) {
            if (chunk)
                chunks.push(chunk)

            const chunks_string = Buffer.concat(chunks).toString('utf8')

            if (!res.sent) res.sent = { }
            
            try {
                res.sent.body = JSON.parse(chunks_string)
            } catch (e) {
                res.sent.body = chunks_string
            }

            res_methods.end.apply(res, arguments)
        }
    },


    /**********************************************************************
     * method _redact
     * 
     * Extracts the headers, parameters and body from an Express.js
     * request/response pair and performs any redaction specified in the
     * endpoint operation carried out by the request.
     * 
     * @param {Express.Request} req - an Express.js Request object
     * @param {Express.Response} res - an Express.js Response object
     */
    _redact: function(req, res) {
        const redaction = req.operation.redact || res.operation.redact
        const result = {
            request: {
                headers: { },
                query: { },
                body: { }
            },
            response: {
                headers: { },
                body: { }
            }
        }

        Object.assign(result.request.headers, req.headers)
        Object.assign(result.request.query, req.query)
        Object.assign(result.request.body, req.body)

        Object.assign(result.response.headers, res.sent.headers)
        Object.assign(result.response.body, res.sent.body)
        
        if (!redaction)
            return result

        const redact = (target, redact_spec) => {
            if ('*' in redact_spec) {
                const spec = { }

                const policy = redact_spec['*']
                delete redact_spec['*']

                Object.keys(target).map(key => {
                    const accounted_for = Object.keys(redact_spec).map(spec_key => spec_key.startsWith(key))
                    if (!accounted_for.includes(true))
                        redact_spec[key] = policy
                })
            }

            for (let path in redact_spec) {
                const spec = redact_spec[path]

                if (path[0] === '$')
                    path = path.substr(1)

                const datum = _.get(target, path)

                if (!datum)
                    continue

                if (typeof spec === 'boolean' && spec) {
                    _.set(target, path, '[redacted]')
                } else if (typeof spec === 'function') {
                    _.set(target, path, spec(datum))
                } else if (typeof spec === 'object') {
                    redact(datum, spec)
                }
            }
        }

        if (redaction.request)
            redact(result.request, redaction.request)
        if (redaction.response)
            redact(result.response, redaction.response)

        return result
    },

    /**********************************************************************
     * method middleware
     *
     * Returns an Express.js middleware function to log HTTP requests and
     * responses.
     */
    middleware: function() {
        const self = this

        return function(req, res, next) {
            self._wrapResponseSetHeader(res)
            self._wrapResponseWriteAndEnd(res)

            res.on('finish', function() {
                const { request, response } = self._redact(req, res)

                request.timestamp = req.timestamp
                request.path = req.route.path
                request.user = {
                    _id: req.user._id,
                    account: {
                        _id: req.user.account._id
                    }
                }
                request.ip = req.ip

                response.statusCode = res.statusCode

                self.log( self.createLogRecord(request, response) )
            })

            next()
        }
    },

    /**********************************************************************
     * method createLogRecord
     *
     * Returns an object describing an HTTP request and/or response.
     * 
     * @param {object} request - an object describing the headers, parameters
     * and body of an HTTP request
     * @param {object} response - an object describing the headers and body
     * of the response to `request`
     */
    createLogRecord: function(request, response) {
        return { request, response }
    },

    /**********************************************************************
     * method log
     *
     * Persists a log record generated by createLogRecord().
     * 
     * @param {object} record - the record to log
     */
    log: function(record) {
        throw new Error('Not implemented')
    }
})

module.exports = RequestLogger