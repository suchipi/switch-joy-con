#!/usr/bin/env -S node -i -r
process.env.DEBUG = "switch-joy-con:*";

j = require(".");
ds = j.listConnectedJoyCons();
d = ds[0].open();
