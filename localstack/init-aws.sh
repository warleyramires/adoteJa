#!/bin/bash
set -euo pipefail

echo "==> Criando bucket adoteja-pets no LocalStack..."
awslocal s3 mb s3://adoteja-pets 2>/dev/null || echo "==> Bucket ja existe, continuando..."

echo "==> Bucket adoteja-pets pronto!"
