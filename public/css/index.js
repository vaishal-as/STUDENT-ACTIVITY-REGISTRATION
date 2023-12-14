function popup(){
    var login=document.getElementById('login');
    var container=document.getElementById('container')
    login.style.display='block';
    container.style.display='none';
}
function popupc(){
    var login=document.getElementById('login');
    var container=document.getElementById('container')
    login.style.display='none';
    container.style.display='block';
}

function scrollToSection(sectionId) {
    var section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: 'smooth' });
  }
  function valid(){
    const inputField1 = document.getElementById("inputField1");
    const inputField2 = document.getElementById("inputField2");
    const inputField3 = document.getElementById("inputField3");
    const inputField4 = document.getElementById("inputField4");
    const messageSpan1 = document.getElementById("message1");
      const messageSpan2 = document.getElementById("message2");
      const messageSpan3 = document.getElementById("message3");
      const messageSpan4 = document.getElementById("message4");
      inputField1.addEventListener("input", function valid1() {
        if (inputField1.value !== "") {
          messageSpan1.style.display = "none";
        } else {
          messageSpan1.style.display = "inline";
        }
      });
      inputField2.addEventListener("input", function valid2() {
        if (inputField2.value !== "") {
          messageSpan2.style.display = "none";
        } else {
          messageSpan2.style.display = "inline";
        }
      });
      inputField3.addEventListener("input", function valid3() {
        if (inputField3.value !== "") {
          messageSpan3.style.display = "none";
        } else {
          messageSpan3.style.display = "inline";
        }
      });
      inputField4.addEventListener("input", function valid4() {
        if (inputField4.value !== "") {
          messageSpan4.style.display = "none";
        } else {
          messageSpan4.style.display = "inline";
        }
      });
  }
  
  window.onload = function() {
      
    inputField1.value='';
    inputField2.value='';
    inputField3.value='';
    inputField4.value='';
  }