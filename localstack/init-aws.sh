#!/bin/bash
echo "==> Criando bucket adoteja-pets no LocalStack..."
awslocal s3 mb s3://adoteja-pets
awslocal s3api put-bucket-acl --bucket adoteja-pets --acl public-read
echo "==> Bucket adoteja-pets criado com sucesso!"
