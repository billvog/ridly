# syntax=docker/dockerfile:1

FROM python:3.12.3-slim as builder

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install geospatial library GDAL
RUN <<EOF
apt update
apt install -y --no-install-recommends binutils libpq-dev binutils libproj-dev gdal-bin
EOF

# Install postgres and postgis
RUN apt install -y --no-install-recommends postgresql postgresql-contrib postgis postgresql-postgis-scripts

# Install dependencies
COPY requirements.txt /app/
RUN pip install -r requirements.txt

COPY . /app/

# Development Environment
FROM builder as dev-envs

WORKDIR /app

RUN <<EOF
apt install -y --no-install-recommends git
EOF

RUN <<EOF
groupadd docker
useradd -ms /bin/bash -g docker vscode
EOF

USER vscode
