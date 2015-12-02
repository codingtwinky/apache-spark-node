"use strict";

var java = require("./java");
var sqlContext = require("./sqlContext");
var functions = require("./functions");

function sparkConf() {
    var SparkConf = java.import("org.apache.spark.SparkConf");
    var conf = new SparkConf();
    return conf;
}

function spark_parseArgs(args) {
    var jArgs = java.newArray("java.lang.String", args);
    var NodeSparkSubmit = java.import("org.apache.spark.deploy.NodeSparkSubmit");
    NodeSparkSubmit.apply(jArgs);
}

var sc;

function sparkContext(args, assembly_jar) {
    if (sc) return sc;

    java.classpath.push(assembly_jar);
    spark_parseArgs(args);

    var SparkContext = java.import("org.apache.spark.SparkContext");

    var conf = sparkConf();
    sc = new SparkContext(conf);

    // don't do INFO logging by default (should eventually expose this via
    // some API)
    var logger = java.import("org.apache.log4j.Logger");
    var level = java.import("org.apache.log4j.Level");
    logger.getRootLogger().setLevel(level.WARN);

    return sc;
}


function sqlContext_(args, assembly_jar) {

    var sc = sparkContext(args, assembly_jar);

    return sqlContext(sc);
}

module.exports = {
    sparkContext: sparkContext,
    sqlContext: sqlContext_,
    sqlFunctions: functions
};