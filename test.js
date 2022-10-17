"use strict";
const mal = require('./index');

/* Simula um request, não faz de verdade para evitar usos desnecessários do MAL */
mal.get('TESTING_USAGE').then(console.log);