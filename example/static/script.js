function startPage() {

  var client;
  var username = document.getElementById('username');
  var password = document.getElementById('password');
  var login = document.getElementById('login');
  var logout = document.getElementById('logout');
  var loginStatus = document.getElementById('loginStatus');

  login.onclick = function() {
    loginStatus.innerHTML = 'pending login';
    client = new Happner.MeshClient();
    client.login({
      username: username.value,
      password: password.value
    });
    client.once('login/allow', function() {
      loginStatus.innerHTML = 'logged in as ' + username.value;
    });

    client.once('login/deny', function(error) {
      loginStatus.innerHTML = error.toString();
    });

    client.once('login/error', function(error) {
      loginStatus.innerHTML = error.toString();
    });
  };

  logout.onclick = function() {
    document.cookie = 'happn_token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    loginStatus.innerHTML = 'logged out';
  };


  var uploadPercentStatus = document.getElementById('uploadPercentStatus');
  var uploadStatus = document.getElementById('uploadStatus');
  var oem1File = document.getElementById('oem1-file');
  var oem2File = document.getElementById('oem2-file');

  var uploadFile = function(uploadToUrl, fileHandle) {
    uploadPercentStatus.innerHTML = 'uploaded 0%';
    uploadStatus.innerHTML = 'uploading';

    var request = new XMLHttpRequest();
    request.upload.onprogress = function(event) {
      var percent = (event.loaded / event.total * 100);
      uploadPercentStatus.innerHTML = 'uploaded ' + percent + '%';
    };
    request.onreadystatechange = function(e) {
      if(this.readyState === 4) {
        console.log('status', request.status);
        uploadStatus.innerHTML = 'upload done, statusCode ' + request.status;
      }
    };
    request.open('POST', uploadToUrl, true);
    request.send(fileHandle);


  };

  oem1File.onchange = function(event) {
    var fileHandle = event.target.files[0];
    var fileName = fileHandle.name;
    var uploadToUrl = '/happner-files/files/oem1/' + fileName;
    uploadFile(uploadToUrl, fileHandle);
  }

  oem2File.onchange = function(event) {
    var fileHandle = event.target.files[0];
    var fileName = fileHandle.name;
    var uploadToUrl = '/happner-files/files/oem2/' + fileName;
    uploadFile(uploadToUrl, fileHandle);
  }

}
