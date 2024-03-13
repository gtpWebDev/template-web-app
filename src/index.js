import './styles.css';
import DownCaret from "./menu-down.svg";

console.log("TEST");
console.log("TEST");



const element = document.createElement('div');
const img = document.createElement("img");

img.setAttribute("src",DownCaret)


const testText = document.createElement('p');
testText.textContent = "Testing";
testText.setAttribute("id","fontCheck");

element.appendChild(testText);
element.appendChild(img);
document.body.appendChild(element);
