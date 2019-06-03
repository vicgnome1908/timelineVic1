## Timeline

### please find all info in docs folder

### requirement
-	Install docker
-	Install docker-compose
-	Open terminal in root project folder
-	Enter: “docker-compose-up -d” (without quote)
-	first time run my take 5-10 min (pulling docker image from remote)
-	When finish please wait 2 min (prisma deploy create database table)
-	If database model change please run “docker-compose-up” again (2nd run much faster with docker cache)
-	Access graph server at http://localhost:4000
-	List of api can be seen from graphql playground
(for development playground is enable, playground will be disable in production server)
-	Local deployment script is place in “docker-compose.yml” file
-	Sampe kubernetes deployment script can be found in k8s-node folder (need to change to actual credential gke in order to work)
