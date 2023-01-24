// QR Code Reader

const readerBox = document.querySelector(".reader_box"),
form = document.querySelector("form"),
fileInp = form.querySelector("input"),
infoText = form.querySelector("p"),
iFont = form.querySelector("i"),
closeBtn = document.querySelector(".closeBtn"),
copyBtn = document.querySelector(".copyBtn"),
loader = document.querySelector("#loader");

function fetchRequest(file, formData) {
    iFont.style.display = 'none';
    loader.style.display = 'block';
    infoText.innerText = "Scanning QR Code...";
    fetch("http://api.qrserver.com/v1/read-qr-code/", {
        method: 'POST', body: formData
    }).then(res => res.json()).then(result => {
        result = result[0].symbol[0].data;
        infoText.innerText = result ? `Click To Choose Or
        Drop QR Code To Read` : "Couldn't Scan QR Code...Click To Choose Or Drop Another QR Code To Read";
        loader.style.display = 'none';
        if(!result) return;
        document.querySelector("textarea").innerText = result;
        form.querySelector("img").src = URL.createObjectURL(file);
        readerBox.classList.add("active");
    }).catch(() => {
        infoText.innerText = "Couldn't Scan QR Code...Click To Choose Or Drop Another QR Code To Read";
        loader.style.display = 'none';
    });
}

fileInp.addEventListener("change", async e => {
    let file = e.target.files[0];
    if(!file) return;
    let formData = new FormData();
    formData.append('file', file);
    fetchRequest(file, formData);
});

copyBtn.addEventListener("click", () => {
    let text = document.querySelector("textarea").textContent;
    navigator.clipboard.writeText(text);
});

form.addEventListener("click", () => fileInp.click());

closeBtn.addEventListener("click", () => {
  loader.style.display = 'none';
  iFont.style.display = 'block';
  readerBox.classList.remove("active");
});

// Drag & Drop 

form.addEventListener("dragenter",(e) => {
    e.preventDefault();
    e.stopPropagation();
    form.classList.add("drop_active");
  },false
);
  
form.addEventListener("dragleave",(e) => {
    e.preventDefault();
    e.stopPropagation();
    form.classList.remove("drop_active");
  },false
);

form.addEventListener("dragover",(e) => {
    e.preventDefault();
    e.stopPropagation();
    form.classList.add("drop_active");
  },false
);

form.addEventListener("drop",(e) => {
    e.preventDefault();
    e.stopPropagation();
    form.classList.remove("drop_active");
    let draggedData = e.dataTransfer;
    files = draggedData.files;
    file = files[0];
    formData = new FormData();
    formData.append('file', file);
    fetchRequest(file, formData);
  },false
);

// End QR Code Reader

// QR Code Generator

const showQr = document.querySelector(".show_qr");
const userInput = document.getElementById("userInput");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const downloadBtn = document.getElementById("downloadBtn");

let QR_Code;

const inputFormatter = (value) => {
  value = value.replace(/[^a-z0-9A-Z]+/g, "");
  return value;
};

submitBtn.addEventListener("click", async () => {
  showQr.innerHTML = "";
  QR_Code = await new QRCode(showQr, {
    text: userInput.value,
});

  const src = showQr.firstChild.toDataURL("image/pmg");
  downloadBtn.href = src;
  let userValue = 'Untitled';
  try {
    userValue = new URL(userValue).hostname;
  } catch (_) {
    userValue = inputFormatter(userValue);
    downloadBtn.download = `${userValue}CosaslearningQR`;
    downloadBtn.classList.remove("hide");
    submitBtn.classList.add("hide");
    cancelBtn.classList.remove("hide");
    submitBtn.disabled = false;
  }
});

userInput.addEventListener("input", () => {
  if (userInput.value.trim().length < 1) {
    submitBtn.disabled = true;
    downloadBtn.href = "";
    downloadBtn.classList.add("hide");
  } else {
    submitBtn.disabled = false;
  }
});

downloadBtn.addEventListener("click", () => {
  window.onload();
});
cancelBtn.addEventListener("click", () => {
  window.onload();
});

window.onload = () => {
  showQr.innerHTML = "";
  userInput.value = "";
  downloadBtn.classList.add("hide");
  cancelBtn.classList.add("hide");
  submitBtn.disabled = true;
  submitBtn.classList.remove("hide");
};

// End QR Code Generator

// Toast Notification

let toastBox = document.getElementById('toastBox');

function showToast(){
  let toast = document.createElement('div');
  toast.classList.add('toast');
  toast.innerHTML = '<i class="fa-solid fa-circle-check"></i> Copied!';
  toastBox.appendChild(toast);

  setTimeout(()=>{
    toast.remove();
  },3000);
}

// End Toast Notification