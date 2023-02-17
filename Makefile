build:
	docker build -t nestjs-xignature .  

infra:
	docker network create -d bridge nestjs-default ; true 
	docker-compose -f ./docker-compose.yaml -p nestjs up -d --force-recreate testdb

run-nest:
	docker kill nestjs || true
	docker rm nestjs || true
	docker run -it --init -p 3000:3000  --network nestjs_default --name nestjs nestjs-xignature 
