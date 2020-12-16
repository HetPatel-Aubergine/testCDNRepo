let s = new URLSearchParams(window.location.search)
const e = React.createElement;
const domContainer = document.querySelector('#custom-content');

const activeContentLink = document.querySelector(`#${s.get('content')}`)

if (activeContentLink){
    activeContentLink.classList.toggle('font-medium')
} else {
    const defaultLink = document.querySelector(`#default-link`)
    defaultLink.classList.toggle('font-medium')
}

if (s.get('content') === "bank-detail") {
    // Load Bank Detail component
    ReactDOM.render(e(BankDetail), domContainer);
} else if (s.get('content') === "registry-detail") {
    // Load Bank Detail component
    ReactDOM.render(e(RegistryDetail), domContainer);
} else {
    // Default component is Registry Detail
    ReactDOM.render(e(MyDetail), domContainer);
}