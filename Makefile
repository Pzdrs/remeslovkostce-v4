DOCKER_BUILD_PLATFORMS ?= linux/amd64,linux/arm64

dev:
	docker-compose -f docker/compose.dev.yaml up

build-strapi-%:
	cd strapi && \
	docker buildx build \
		--platform=$(DOCKER_BUILD_PLATFORMS) \
		-t registry.gitlab.pycrs.cz/remeslovkostce/remeslovkostce-v4/strapi:$* \
		--provenance=false \
		.

build-web-%:
	cd web && \
	docker buildx build \
		--platform=$(DOCKER_BUILD_PLATFORMS) \
		-t registry.gitlab.pycrs.cz/remeslovkostce/remeslovkostce-v4/web:$* \
		--provenance=false \
		.