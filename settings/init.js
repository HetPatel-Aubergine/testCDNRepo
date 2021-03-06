// Constant global variables
var CONSTANTS = {
    ACCESS_COOKIE_NAME: "access_token",
    BACKEND_ENDPOINT: "https://registry-api.lilhathee.com",
    API_ENDPOINT_GRAPHQL: "https://registry-api.lilhathee.com/api/graphql",
    BOOKMARKLET_SCRIPT: "javascript:(function()%7Blet%20script%20%3D%20document.createElement('script')%3Bscript.src%20%3D%20'https%3A%2F%2Fregistry-api.lilhathee.com%2Fbookmarklet.js'%3Bdocument.body.appendChild(script)%7D)()",
    BOOKMARKLET_STEP_THREE_PRODUCT_LINK: "https://www.target.com/p/wubbanub-elephant-pacifier-gray/-/A-50806426",
}

// Queries
var GET_REGISTRY = `
query {
    registries {
      edges {
        node {
          id
          name
          urlSlug
          greeting
          displayName
          isFeaturedNoticeRead
          isFeatured
          image {
            id
            image
          }
          dueDate
          isPublic
          childrenQuestions {
            dueDate
            numberOfChildren
            gender
          }
          user{
            email
          }
          isCashInLieuItemAdded
          isCashFundItemAdded
        }
      }
    }
  }
`

var CURRENT_USER = `
    query {
        currentUser {
            firstName
            lastName
            email
            bankAccounts{
                id,
                routingNumber,
                accountNumber,
                firstName,
                lastName,
                addressLine1,
                addressLine2,
                city,
                bankAccountType,
                province,
                country,
                zip,
                phone,
                dateOfBirth,
                tncAccepted
            }
            partner {
                id
                firstName
                lastName
                email
                accountState
              }
        }
    }
`

getCookie = (cname) => {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// Loader Handlers
startLoader = () => {
    let loaderEl = document.querySelector("#ma-account-loader")
    if (!loaderEl){
        loaderEl = document.createElement("div")
        loaderEl.setAttribute("id", "ma-account-loader")
        loaderEl.setAttribute("class", "ma-loader-class")
        loaderEl.innerHTML = `
        <div class="MA-loader-spinner spinner-border" role="status">
            <span class="sr-only">Loading...</span>
        </div>
        `
        document.body.appendChild(loaderEl)
    }
}

endLoader = () => {
    let loaderEl = document.querySelector("#ma-account-loader")
    if (loaderEl) {
        document.body.removeChild(loaderEl)
    }
}

//  Updating Registry detail
updateRegistryDetail = async () => {
    let access_token = getCookie(CONSTANTS.ACCESS_COOKIE_NAME)
    let returnData = null
    if (access_token) {
        let reqData = {
            query: GET_REGISTRY
        }

        let response = await fetch(CONSTANTS.API_ENDPOINT_GRAPHQL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Token ${access_token}`
            },
            body: JSON.stringify(reqData)
        }).then(res => res.json())
            .then(res => {
                if (res.data) {
                    // Success
                    if (res.data.registries && res.data.registries.edges && res.data.registries.edges.length > 0) {
                        registryDetail = res.data.registries.edges[res.data.registries.edges.length - 1].node;
                        returnData = registryDetail;
                    }
                } else if (res.errors) {
                    // Error
                    console.error(res.errors)
                }
            })
    }
    return returnData
}

// Current User Detail
updateCurrentUserDetail = async () => {
    let access_token = getCookie(CONSTANTS.ACCESS_COOKIE_NAME)
    let returnData = null
    if (access_token) {
        let reqData = {
            query: CURRENT_USER
        }

        let response = await fetch(CONSTANTS.API_ENDPOINT_GRAPHQL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Token ${access_token}`
            },
            body: JSON.stringify(reqData)
        }).then(res => res.json())
            .then(res => {
                if (res.data) {
                    // Success
                    if (res.data.currentUser) {
                        returnData = res.data.currentUser;
                    }
                } else if (res.errors) {
                    // Error
                    console.error(res.errors)
                }
            })
    }
    return returnData
}

getRegistry = async () => {
    startLoader();
    let registryData = await updateRegistryDetail();
    endLoader();
    return registryData;
}

updateLinkActiveState = () => {
    let s = new URLSearchParams(window.location.search)
    let activeContentLink = document.querySelector(`#${s.get('content')}`)
    if (!activeContentLink){
      activeContentLink = document.querySelector(`#${s.get('view')}`)
    }

    if (activeContentLink){
        activeContentLink.classList.toggle('font-medium')
    } else {
        const defaultLink = document.querySelector(`#default-link`)
        defaultLink.classList.toggle('font-medium')
    }
}

getRegistry().then(res => {
    if (res && res.id){
        // Loading Sidebar registry links only if user have registry
        let sidebarRegistryElement = document.getElementById('settings-sidebar-registry');
        sidebarRegistryElement.innerHTML = `
        <p class="settings-sidebar-heading text-sm">Registry</p>
        <a href="?content=registry-detail" id="registry-detail" class="settings-sidebar-link d-block text-body">Registry Details</a>
        <a href="?content=bank-detail" id="bank-detail" class="settings-sidebar-link d-block text-body">Bank Details</a>
        `
        // Loading M+A Button
        let sidebarRegistryMAButtonElement = document.getElementById('settings-sidebar-ma-button');
        sidebarRegistryMAButtonElement.innerHTML = `
        <p class="settings-sidebar-heading text-sm">M+A Button</p>
        <a href="?content=m-a-button" id="m-a-button" class="settings-sidebar-link d-block text-body">Get M+A Button</a>
        `
    }

    updateLinkActiveState()
})