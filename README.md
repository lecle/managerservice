Manager MicroService
=====
[![Build Status](https://travis-ci.org/lecle/managerservice.svg?branch=master)](https://travis-ci.org/lecle/managerservice)
[![Coverage Status](https://coveralls.io/repos/lecle/managerservice/badge.svg?branch=master)](https://coveralls.io/r/lecle/managerservice?branch=master)

MicroService의 생성, 확장, 축소, 재배치, 포트 부여, 모니터링 등의 관리를 담당한다.

Manager MicroService의 종류 
-----

Manager MicroService(이하 Manager)는 실행 환경에 따라 종류가 다를 수 있다.

* standalone
* AWS EC2
* MS Azure
* Docker
* 등등...

MicroService Container의 생성 
-----

MicroService Container(이하 Container)를 생성한다.

* 필요한 경우 Manager의 종류에 맞게 Container process를 생성한다.
* 전략에 따라 미리 여분의 Container process를 생성해 놓고 pool로 관리할 수도 있고, 필요할 때 그때그때 생성할 수도 있다.
* 처음 Manager 생성시에는 필요한 만큼의 Container를 생성한다.

MicroService의 생성
-----

Container에게 역할을 할당한다

* Manager는 생성시 전체 서비스에 필요한 MicroService 목록을 가지고 있다. (환경에 따라 DB일수도, 파일일수도 있다.)
* Container 생성시 로드해야 할 MicroService를 알려준다.
* 더이상 필요한 목록이 없을 경우 Container를 대기상태로 만든다.

MicroService의 확장
-----

MicroService에 과부하가 걸릴 경우 Container가 Manager에게 확장을 요구한다. 이와 별계로 모니터링중 필요하다고 판단하거나 관리자의 요청에 의해서도 확장할 수 있다.

* 대기상태의 Container가 있을 경우 우선 할당한다.
* 리소스 목록을 통해 프로세스를 추가할 수 있는 서버가 있을 경우 Container 프로세스를 추가한다.
* 새로운 서버가 필요할 경우 각 Manager의 종류에 따라 새로운 서버를 요청할 수 있다.

MicroService의 축소 
-----

* 확장된 MicroService는 모니터링을 통해 축소가 필요할 경우 Container에게 소멸을 명령한다.
* 서버의 모든 Container가 소멸된 경우 Manager의 종류에 따라 서버를 삭제할 수 있다.

MicroService의 재배치 
-----

Manager의 종류에 따라 서버 자원을 반납해야 할 필요가 있을 경우 다른 서버에 MicroService를 확장한 뒤 잠시 후 기존 서비스를 소멸시키는 방식으로 재배치 할 수 있다.

Container의 포트 부여 
-----

Container에 역할을 할당할 때 사용할 포트를 함께 전송하여 Container간의 포트 중복을 제거한다.

모니터링 
-----

각 Container의 모니터링 기능을 이용해 실시간으로 사용 상태를 모니터링하여 확장/축소/재배치에 사용한다. 또한, 서버가 죽거나 통신불능 상태가 된 경우 복구를 담당한다. 복구는 확장 후 기존 서비스를 소멸시키는 방식으로 한다. 복구처리는 모니터링 외에도 Container에게 오류보고를 받는 방식으로도 처리한다.
