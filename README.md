Manager MicroService
=====
[![Build Status](https://travis-ci.org/lecle/managerservice.svg?branch=master)](https://travis-ci.org/lecle/managerservice)
[![Coverage Status](https://coveralls.io/repos/lecle/managerservice/badge.svg?branch=master)](https://coveralls.io/r/lecle/managerservice?branch=master)

It deals with the management of creation, extension, reduction, rearrangement, port allocation, monitoring, etc for MicroService.


Category of Manager MicroServices
-----

Manager MicroService(Hereinafter “Manager”) operates differently depending on executing enviroment.

* standalone
* AWS EC2
* MS Azure
* Docker, etc

Creating MicroService Container
-----

Manager creates MicroService Container(Hereinafter “Container”).

* Container process is created according to the kind of the Manager, if required.
* According to your strategy, the Manager creates Container processes in advance and manages them as well as the creation of  the Container can be done dynamically.
* When the Manager is created for the first time, it creates containers as needed.

Creating MicroService
-----

It allocates a task to a container.

* The newly created manager has a list of the MicroService required for entire service. 
( The list may be a file or stored at database depending on circumstances. )
* The newly created container notifies which MicroServices to be loaded.
* If the list is no longer needed, the manager makes the Container wait state.

Expanding MicroService
-----

When the MicroService is overloaded, the Container asks Manager for extension. Apart from this, the Container can be extended by the request of the administrator or if it is required during monitoring as well.

* If there is a container on wait state, it is allocated primarily.
* If there is a server which can add processes through its list, the Manager adds the Container processes to the Container.
* When it comes to need a new server, the Manager is able to require new one according to the kind of the Manager.

Reducing MicroService
-----

* The extended MicroService instructs the Container demanding a shrink through monitoring to be destroyed, if necessary.
* If every container in the server is destoryed,  according to the type of Manager, it can delete the server.

Rearranging MicroService
-----

In accordance with the type of the Manger, if there is a situation that server resource has to be released, the Manager rearranges by destroying the existing service after extending the MicroService to other server.

Allocating port number to the Container
-----

When tasks are allocated to the Container, because the Manager sends an available port number, the port duplication between Containers will not happen.

Monitoring
-----

* Using the monitoring functionality on each container, the current status of the server usage is monitored. Accordingly, the Manager will decide extension, reduction or rearrangement on the MicroService.
* In addition, the Manager takes charge of recovery when the server is down or there are network failures.
* The way of the recovery is to extend the existing service and then destroy the service.
* Recovery process besides monitoring is done when the Manger receives error reports from Containers.