.. class:: carbond.SwaggerDescriptorGenerator
    :heading:

.. |br| raw:: html

   <br />

==================================
carbond.SwaggerDescriptorGenerator
==================================

Builds a swagger descriptor from a :class:`~carbond.Service` and its endpoints. This is used create the swagger administrative interface.

Methods
-------

.. class:: carbond.SwaggerDescriptorGenerator
    :noindex:
    :hidden:

    .. function:: carbond.SwaggerDescriptorGenerator.generateSwaggerDescriptor(service, req)

        :param service: The service instance to generate a descriptor for
        :type service: :class:`~carbond.Service`
        :param req: Use the request, if present, to update the host field in the descriptor
        :type req: :class:`~carbond.Request`
        :rtype: Object

        Generates the descriptor
