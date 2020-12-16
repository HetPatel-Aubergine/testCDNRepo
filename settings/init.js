// Constant global variables
var CONSTANTS = {
    ACCESS_COOKIE_NAME: "access_token",
    API_ENDPOINT_GRAPHQL: "https://3.12.191.197/api/graphql"
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
                    if (res.data.registries?.edges && res.data.registries.edges.length > 0) {
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
                    if (res.data.registries?.edges && res.data.registries.edges.length > 0) {
                        // Getting last registry detail
                        returnData = res.data.registries.edges[res.data.registries.edges.length - 1].node;
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
    let registryData = await updateRegistryDetail();
    return registryData;
}

updateLinkActiveState = () => {
    const activeContentLink = document.querySelector(`#${s.get('content')}`)

    if (activeContentLink){
        activeContentLink.classList.toggle('font-medium')
    } else {
        const defaultLink = document.querySelector(`#default-link`)
        defaultLink.classList.toggle('font-medium')
    }
}

getRegistry().then(res => {
    if (res.id){
        // Loading Sidebar registry links only if user have registry
        let sidebarRegistryElement = document.getElementById('settings-sidebar-registry');
        sidebarRegistryElement.innerHTML = `
        <p class="settings-sidebar-heading text-sm">Registry</p>
        <a href="?content=registry-detail" id="registry-detail" class="settings-sidebar-link d-block text-body">Registry Details</a>
        <a href="?content=bank-detail" id="bank-detail" class="settings-sidebar-link d-block text-body">Bank Details</a>
        `
    }

    updateLinkActiveState()
})