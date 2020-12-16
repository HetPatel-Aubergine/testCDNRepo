let s = new URLSearchParams(window.location.search)
const e = React.createElement;
const domContainer = document.querySelector('#custom-content');

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