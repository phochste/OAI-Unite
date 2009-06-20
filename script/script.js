var identify_file = 'identify.xml';
var metadataformats_file = 'metadata_formats.xml';
var baseURL = 'http://my.hochsten.operaunite.com/oai/';

var webserver;

var ERROR = {
    BAD_VERB : 0 ,
    NO_SET_HIERARCHY : 1 ,
    BAD_RESUMPTION_TOKEN : 2 ,
    ID_DOES_NOT_EXIST : 3 ,
    NO_METADATA_FORMATS : 4 ,
    CAN_NOT_DISSEMINATE_FORMAT : 5
};

window.onload = function () {
    webserver = opera.io.webserver

    if (webserver) {
        webserver.addEventListener('_index', doOAI, false);
    }
}

function doOAI(e) {
    var request = e.connection.request;
    var verb = param(request, 'verb');
    
    if (verb == null) {
        doError(e, ERROR.BAD_VERB);
    }
    else if (verb == 'Identify') {
        doIdentify(e);
    }
    else if (verb == 'ListSets') {
        doListSets(e);
    }
    else if (verb == 'ListMetadataFormats') {
        doListMetadataFormats(e);
    }
    else if (verb == 'GetRecord') {
        doGetRecord(e);
    }
    else if (verb == 'ListIdentifiers') {
        doListRecords(e, false);
    }
    else if (verb == 'ListRecords') {
        doListRecords(e, true);
    }
    else {
        doError(e, ERROR.BAD_VERB);
    }
}

function doListRecords(e, long) {
    var request  = e.connection.request;
    var response = e.connection.response;
    var from           = param(request, 'from');
    var until          = param(request, 'until');
    var set            = param(request, 'set');
    var resumptionToken = param(request, 'resumptionToken');
    var metadataPrefix = param(request, 'metadataPrefix');
    
    if (metadataPrefix == null) {
        return doError(e, ERROR.CAN_NOT_DISSEMINATE_FORMAT);
    }
    else if (metadataPrefix != 'oai_dc') {
        return doError(e, ERROR.CAN_NOT_DISSEMINATE_FORMAT);
    }
    else if (resumptionToken != null) {
        return doError(e, ERROR.BAD_RESUMPTION_TOKEN);
    }
    else if (set != null) {
        return doError(e, ERROR.NO_SET_HIERARCHY);
    }

    response.setResponseHeader("Content-type", "text/xml");
    response.write(OAIHeader(parseBaseURL(request), { 
                    verb: 'GetRecord' ,
                    metadataPrefix: metadataPrefix ,
                    from: from ,
                    until: until 
                    }));
    
    response.write('<ListIdentifiers>');

    process_dir('/application/public_html', function (file) {
        var identifier = path2identifier(file.path);
        var date = file_date(file.path);
        if (datematch(date,from,until)) {
            response.write(OAIRecord(identifier, long));
        }
    });
    
    response.write('</ListIdentifiers>');   
    response.write(OAIFooter());
    response.close();
}

function doGetRecord(e) {
    var request  = e.connection.request;
    var response = e.connection.response;
    var metadataPrefix = param(request, 'metadataPrefix');
    var identifier     = param(request, 'identifier');
    
    if (identifier == null) {
        return doError(e, ERROR.ID_DOES_NOT_EXIST);
    }
    else if (metadataPrefix == null) {
        return doError(e, ERROR.CAN_NOT_DISSEMINATE_FORMAT);
    }
    else if (metadataPrefix != 'oai_dc') {
        return doError(e, ERROR.CAN_NOT_DISSEMINATE_FORMAT);
    }
    
    if (! file_exists(identifier2path(identifier))) {
        return doError(e, ERROR.ID_DOES_NOT_EXIST);
    }
    
    response.setResponseHeader("Content-type", "text/xml");
    response.write(OAIHeader(parseBaseURL(request), { 
                    verb: 'GetRecord' ,
                    identifier: identifier ,
                    metadataPrefix: metadataPrefix 
                    }));
    
    response.write('<GetRecord>');
    response.write(OAIRecord(identifier, true));
    response.write('</GetRecord>');   
    response.write(OAIFooter());
    response.close();
}

function doListMetadataFormats(e) {
    var request  = e.connection.request;
    var response = e.connection.response;
    response.setResponseHeader("Content-type", "text/xml");
    response.write(OAIHeader(parseBaseURL(request), { verb: 'ListMetadataFormats' }));
 
    var content = file_content('/application/' + metadataformats_file);
    
    if (content != null) {
        response.write(content);
    }
    else {
        response.write('No ' + metadataformats_file + ' found...');
    }
    
    response.write(OAIFooter());
    response.close();
}

function doListSets(e) {
    var request  = e.connection.request;
    var response = e.connection.response;
    var resumptionToken = param(request, 'resumptionToken');
    
    if (resumptionToken != null) {
        return doError(e, ERROR.BAD_RESUMPTION_TOKEN);
    }
    else {
        return doError(e, ERROR.NO_SET_HIERARCHY);
    }
}

function doIdentify(e) {
    var request  = e.connection.request;
    var response = e.connection.response;
    response.setResponseHeader("Content-type", "text/xml");
    response.write(OAIHeader(parseBaseURL(request), { verb: 'Identify' }));
 
    var content = file_content('/application/' + identify_file);
    
    if (content != null) {
        response.write(content);
    }
    else {
        response.write('No ' + identify_file + ' found...');
    }
    
    response.write(OAIFooter());
    response.close();   
}

function doError(e, error) {
    var request  = e.connection.request;
    var response = e.connection.response;
    response.setResponseHeader("Content-type", "text/xml");
    response.write(OAIHeader(parseBaseURL(request), null));
    
    if (error == ERROR.BAD_VERB) {
        response.write(OAIError('badVerb','Illegal OAI verb'));
    }
    else if (error == ERROR.NO_SET_HIERARCHY) {
        response.write(OAIError('noSetHierarchy','This repository does not support sets'));
    }
    else if (error == ERROR.BAD_RESUMPTION_TOKEN) {
        response.write(OAIError('badResumptionToken','The value of the resumptionToken is invalid'));
    }
    else if (error == ERROR.ID_DOES_NOT_EXIST) {
        response.write(OAIError('idDoesNotExist','The value of the identifier is invalid'));
    }
    else if (error == ERROR.NO_METADATA_FORMATS) {
        response.write(OAIError('noMetadataFormats','There are no metadata formats available for the specified item'));
    }
    else if (error == ERROR.CAN_NOT_DISSEMINATE_FORMAT) {
        response.write(OAIError('noMetadataFormats','The value of the metadataPrefix argument is not supported by the item identified by the value of the identifier argument'));
    }
    else {
        response.write(OAIError('badVerb','Illegal OAI verb'));
    }
    
    response.write(OAIFooter());
    response.close();
}

function OAIError(code,message) {
   var ret = '<error code="' + code + '">' + message + '</error>';
   return ret;
}

function OAIRecord(identifier, long) {
    var buf = '';
    
    buf += '<record>';
    buf += OAIRecordHeader(identifier);
    buf += '<metadata>';
    
    if (long) {
      var content = file_content(identifier2path(identifier));
      buf += content;
    }
    
    buf += '</metadata>';
    buf += '</record>';
    
    return buf;
}

function OAIRecordHeader(identifier) {
    var datestamp = file_date(identifier2path(identifier));
    
    var buf = '<header>';
    buf += '<identifier>' + identifier + '</identifier>';
    buf += '<datestamp>' + datestamp + '</datestamp>';
    buf += '</header>';
    
    return buf;
}

function OAIHeader(baseURL, param) {
   var ret = '<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/ http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd">';
   var date = new Date();
   ret += '<responseDate>' + ISODate(new Date(), true) + '</responseDate>';
   ret += '<request';
   if (param != null) {
       if (param.verb != null) {
           ret += ' verb="' + param.verb + '"';
       }
   }
   ret += '>';
   ret += baseURL
   ret += '</request>';
   return ret;
}

function OAIFooter() {
   var ret = '</OAI-PMH>';
   return ret;
}

function parseBaseURL(request) {
    return baseURL;
}

function ISODate(date, long) {
    var buf = '';

    var year  = date.getYear();
    buf += dd(year);
    buf += '-';
       
    var month = date.getMonth();
    buf += dd(month + 1);
    buf += '-';
    
    var day = date.getDate();
    buf += dd(day+1);

    if (long) {
        buf += 'T';
            
        var hour = date.getHours();
        buf += dd(hour);
        buf += ':';
    
        var minute = date.getMinutes();
        buf += dd(minute);
        buf += ':';
    
        var second = date.getSeconds();
        buf += dd(second);
        buf += 'Z';
    }

    return buf;
}

function dd(num) {
    return num / 10 >= 1 ? num : '0' + num;
}

function param(request,name) {
    var vals = request.getItem(name);
    return vals == null ? null : vals[0];
}

function file_exists(path) {
    var dir = opera.io.filesystem.mountSystemDirectory('application');
    var file = dir.resolve(path);
    
    if (file.exists && file.isFile) {
         return true;
    }
    else {
        return false;
    }
}

function file_date(path) {
    var dir = opera.io.filesystem.mountSystemDirectory('application');
    var file = dir.resolve(path);
    
    if (!file.exists || !file.isFile) {
         return null;
    }
    
    return ISODate(file.modified, false);
}

function file_content(path) {
    var dir = opera.io.filesystem.mountSystemDirectory('application');
    var file = dir.resolve(path);
    
    if (!file.exists || !file.isFile) {
        return null;
    }
    
    var stream = dir.open(file, opera.io.filemode.READ);
                    
    var buf = null;
    
    if (stream) {
        buf = '';
        var line;
        while ( (line = stream.readLine()) != null ) {
            buf += line;
        }
        stream.close();
    }
    
    return buf;
}

function process_dir(path, callback) {
    var dir = opera.io.filesystem.mountSystemDirectory('application');
    var files = dir.resolve(path);
    files.refresh();
    
    for ( var i = 0, file; file = files[i]; i++ ) {
        callback(file);
    }
}

function path2identifier(path) {
    return path.replace('/application/public_html/','').replace('.xml','');
}

function identifier2path(identifier) {
    return '/application/public_html/' + identifier + '.xml';
}

function datematch(date, from, until) {
    if (from == null && date == null) {
        return true;
    }
    
    from  = from  == null ? "0000-00-00" : from;
    until = until == null ? "9999-99-99" : until;

    date  = parseInt(date.replace(/-/,''));
    from  = parseInt(from.replace(/-/,''));
    until = parseInt(until.replace(/-/,''));
    
    if (date >= from && date < until) {
        return true;
    }
    else {
        return false;
    }
}