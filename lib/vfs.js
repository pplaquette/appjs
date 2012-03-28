var isWindows = process.platform === 'win32';

var vfs = exports;

vfs.readFileSync = function(filename,encoding){
  var buffer = new Buffer(4048);
  
  
  //@TODO read from virtual fs

  if (encoding) buffer = buffer.toString(encoding);
  return buffer;
}

vfs.realpathSync = function(path,cache){
  p = resolve(p);
  
  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
      return cache[p];
  }

  vfs.statSync(p);
  if (cache) cache[p] = p;
  return p;
}

vfs.statSync = function(path){
  //@TODO return compatible stat object.
  
}


function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last == '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}


//@TODO I used a posix version of resolve function. 
//      we should check to see if underlying archive
//      maintainer depends on windows or not.
//      Maybe it returns winodws style path.

var resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : '/';

    // Skip empty and invalid entries
    if (typeof path !== 'string' || !path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(resolvedPath.split('/').filter(function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};
