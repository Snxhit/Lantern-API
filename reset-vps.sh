#!/bin/bash
sudo -u postgres psql -d lantern -f database/schema.sql
