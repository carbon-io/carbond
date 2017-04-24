=====================
Application structure
=====================

Defining your Node.js package 
-----------------------------

To build a Carbon.io service you start by creating a standard node package:

.. literalinclude:: ../shell-frags/shell-output-service-tree.rst
    :language: sh


Your ``package.json`` file should include ``carbon-io``:

.. literalinclude:: ../code-frags/hello-world/package.json
    :language: javascript
    :linenos:
    :lines: 1-4,8-

While the ``carbon-io`` dependency shown in the above example will
always pull in the latest version, you will likely want to to pin it to a
specific minor version. e.g.: 

.. XXX we can't use inline markup with substitutions... so we're using
       parse-literal here. 

.. parsed-literal::

    "carbonio": "|version|.x"

You then install the package dependencies like so:

.. code-block:: sh

     % cd /path/to/hello-world
     % npm install .

Defining your Service 
---------------------

Next you create your app / service. Continuing with the example above,
``HelloService.js`` would look something like:

.. todo:: XXX add :lines: when the example gets fleshed out

.. literalinclude:: ../code-frags/hello-world/lib/HelloService.js
    :language: javascript
    :linenos:

Using o, __, and _o
--------------------

The preamble requires the main ``carbon-io`` package as well and
defines the ``o``, ``__``, and ``_o`` operators. 

.. todo:: XXX fix :lines: when the example gets fleshed out

.. literalinclude:: ../code-frags/hello-world/lib/HelloService.js
    :language: javascript
    :linenos:
    :lines: 1-5

The ``__`` operator is used to run this service inside of a `Fiber
<https://github.com/carbon-io/fibers>`_ when this module is invoked as
the main module from the command line. Carbon.io makes heavy use of
`Node Fibers <https://github.com/laverdet/node-fibers>`_ to allow for
services to be written in a synchronous (as well as asynchronous)
style. More details can be found in the documentation for the
Carbon.io `fibers package <https://github.com/carbon-io/fibers>`_.

The ``_o`` operator is the name resolver utility used by Carbon.io. It is not
used in this example, although it is used commonly, and documented as
part of the `bond <https://github.com/carbon-io/bond>`_ sub-project.

The ``o`` operator is part of the Atom sub-project of Carbon.io and 
is what is used to define Carbon.io components. It is not crucial you
understand this deeply at this point but you should eventually read
the `Atom <https://github.com/carbon-io/atom>`_ documentation to
understand the Carbon.io component infrastructure, as it is core to
Carbon.io.

In our example, we define our top-level component and export it via
``module.exports``. While exporting the component we define is not strictly
required if we only plan to use this service as a main module, it is useful to
export it so that it can later be required as a library by other components or
modules if desired.  It should be noted that the component is defined to be an
instance of the :js:class:`~carbond.Service` class. This class is the base class
used for defining services in ``carbond`` and will be described more fully
in subsequent sections.

.. todo:: XXX fix :lines: when the example gets fleshed out

.. literalinclude:: ../code-frags/hello-world/lib/HelloService.js
    :language: javascript
    :linenos:
    :lines: 7-14

Running your Service 
--------------------

Finally, the ``hello-world`` application can be invoked from the command line as
follows:

..  literalinclude:: ../shell-frags/shell-output-starting-service.rst
    :language: sh 

For more details on running ``carbond`` ``Service``\s see the documentation on
:ref:`running services from the command line <running Services from
the command line>`.

