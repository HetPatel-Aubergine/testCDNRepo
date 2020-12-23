'use strict';

// Common Variables
var REGISTRY_PAGE = `${window.location.host}/pages/registry/`

// Common Functions

const apiGraphql = (reqData) => {
    let access_token = getCookie(window.CONSTANTS.ACCESS_COOKIE_NAME)

    return fetch(window.CONSTANTS.API_ENDPOINT_GRAPHQL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': `Token ${access_token}`
        },
        body: JSON.stringify(reqData)
    })
}

// Mutations
var UPDATE_USER = `
mutation updateAccount($firstName: String!, $lastName: String!) {
    updateAccount(accountUpdateInput: {firstName: $firstName, lastName: $lastName}) {
      message
      user {
        firstName
        lastName
        email
      }
    }
  }
`

var RESET_PASSWORD = `
  mutation resetPassword($email: String!){
    resetPassword(email:$email){
        message
    }
  }
`

var UPDATE_REGISTRY_DETAIL = `
    mutation updateRegistry($registryId: Int!, $registryData: RegistryInput!){
        updateRegistry(registryId:$registryId, registryData:$registryData){
        message
        registry{
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
`

var UPDATE_CHILDREN_INFO = `
    mutation updateRegistryChildrenQuestion($registryId: Int!, $childrenInput: RegistryChildrenQuestionInput!){
        updateRegistryChildrenQuestion(
        registryId:$registryId,
        childrenQuestionInput:$childrenInput
        ){
        message
        childrenQuestion {
            dueDate
            numberOfChildren
            gender
        }
        }
    }
`

var ADD_PARTNER_ACCOUNT = `
    mutation addPartnerAccount($partnerInput: AddPartnerAccountInput!) {
        addPartnerAccount(addPartnerAccountInput:$partnerInput) {
        message
        partnerAccount {
            id
            firstName
            lastName
            email
            accountState
          }
        }
    }
`

var UPDATE_PARTNER_ACCOUNT = `
    mutation udpatePartnerAccount($updateInput: UpdatePartnerAccountInput!){
        udpatePartnerAccount(
        updatePartnerInput:$updateInput
        ){
        message
        partnerAccount {
            id
            firstName
            lastName
            email
            accountState
        }
        }
    }
`

var RESEND_INVITATION_EMAIL = `
    mutation resendPartnerInvite {
        resendPartnerInvite(resendInvite:true){
        message
        }
    }
`

var REMOVE_PARTNER_ACCOUNT = `
    mutation removePartnerAccount {
        removePartnerAccount(confirm:true){
        message
        }
    }
`

var ADD_BANK_ACCOUNT = `
    mutation addBankAccount($bankAccountInput: BankAccountInput!){
        addBankAccount(bankAccountInput: $bankAccountInput){
        message,
        bankAccount {
            id
            routingNumber,
            accountNumber,
            firstName,
            lastName,
            bankAccountType,
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
        }
    }
`

var UPDATE_BANK_ACCOUNT = `
    mutation updateBankAccount($bankAccountId: ID!, $bankAccountInput: BankAccountInput!){
        updateBankAccount(bankAccountId: $bankAccountId, bankAccountInput: $bankAccountInput){
        message,
        bankAccount {
            id
            routingNumber,
            accountNumber,
            firstName,
            lastName,
            addressLine1,
            addressLine2,
            bankAccountType,
            city,
            province,
            country,
            zip,
            phone,
            dateOfBirth,
            tncAccepted
        }
        }
    }
`

var REMOVE_BANK_ACCOUNT = `
    mutation removeBankAccount($bankAccountId: ID!){
        removeBankAccount(bankAccountId:$bankAccountId){
        message
        }
    }
`

// Common Components

const toast = (message, type = "success") => {
    let toastClass = "settings-toast-"

    switch (type) {
        case "success":
            toastClass += "success"
            break
        case "error":
            toastClass += "error"
            break
        default:
            toastClass += "success"
            break
    }

    window.Toastify({
        text: `<div class="settings-toast-body d-flex align-items-center">${message}</div>`,
        duration: 4000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "center",
        className: ["settings-toast d-flex justify-content-between", toastClass].join(" ")
    }).showToast();
}

class Button extends React.Component {
    render() {
        let btnVariant = ""
        switch (this.props.variant) {
            case "primary":
                btnVariant = "settings-button-primary";
                break
            case "secondary":
                btnVariant = "settings-button-secondary";
                break
            default:
                btnVariant = "settings-button-primary";
                break;
        }

        return (
            <button
                className={["settings-button", btnVariant, this.props.className ? this.props.className : ""].join(" ")}
                disabled={this.props.disabled ? this.props.disabled : false}
                onClick={this.props.onClick}
            >{this.props.children}</button>
        )
    }
}

const RadioButton = (props) => {
    return (
        <label className={["radio d-flex mb-0", props.className ? props.className : ""].join(" ")}>
            <span className="radio__input mr-2">
                <input
                    type="radio"
                    name={props.name}
                    checked={props.checked ? "checked" : ""}
                    onChange={props.changeHandler}
                />
                <span className="radio__control"></span>
            </span>
            {props.children}
        </label>
    )
}

const ModalComponent = (props) => {
    return (
        <window.ReactBootstrap.Modal show={props.show} size={props.size ? props.size : "xl"} className="m-a-modal">
            {props.title || props.titleContent ?
                <window.ReactBootstrap.Modal.Header className="px-3 pt-3 pb-1 d-block">
                    <div>
                        <div className="d-flex justify-content-between">
                            <h1>{props.title}</h1>
                            <div className="d-flex">
                                {props.headerContent ? props.headerContent : null}
                                <i className="icon-close m-a-modal-close align-self-center" onClick={props.closeModal} />
                            </div>
                        </div>
                    </div>

                    {/* OPTIONAL CONTENT IN TITLE PORTION */}
                    {props.titleContent ? props.titleContent : null}

                </window.ReactBootstrap.Modal.Header> : null}
            <window.ReactBootstrap.Modal.Body className="p-3 m-a-modal-content">
                {props.children}
            </window.ReactBootstrap.Modal.Body>
            {props.footer ?
                <window.ReactBootstrap.Modal.Footer className="px-3 py-3 m-a-modal-footer">
                    {/*  MODAL FOOTER BUTTONS GOES HERE*/}
                    {props.footer}
                </window.ReactBootstrap.Modal.Footer>
                : null}
        </window.ReactBootstrap.Modal>


    )
}

const CheckBox = (props) => {
    return (
        <label className={["checkbox d-flex align-items-center", props.className ? props.className : ""].join(" ")}>
            <span className="checkbox__input mr-2">
                <input
                    type="checkbox"
                    name={props.id}
                    value={props.id}
                    checked={props.checked ? "checked" : ""}
                    onChange={props.changeHandler}
                />
                <span className="checkbox__control d-flex justify-content-center align-items-center">
                    <i className="icon-check"></i>
                </span>
            </span>
            <span className={["radio__label text-sm", props.textClass ? props.textClass : ""].join(" ")}>{props.display} {props.count ? "(" + props.count + ")" : null}</span>
        </label>
    )
}

// Main Components

class RegistryDetail extends React.Component {

    EMAIL_RE = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
    ALPHABET = /^[A-Za-z]+$/g

    state = {
        userInfo: {},
        registry: null,
        registrySearched: false,

        // Registry Detail
        editRegistryDetail: false,
        registryErrors: {},
        editRegistryDetailChanged: false,
        registryLink: "",
        registryName: "",
        registryGreetings: "",
        isPublic: false,

        // Children
        editChildrenInfo: false,
        childErrors: {},
        editChildrenInfoChanged: false,
        dueDate: "",
        numberChildren: 1,
        childrenCount: {},
        gender: "",

        // Partner
        editPartnerInfo: false,
        partnerErrors: {},
        partnerInputChanged: false,
        partnerFirstName: "",
        partnerLastName: "",
        partnerEmail: "",
        partnerRemoveConfirmModal: false
    }

    CHILDREN_COUNT_LIST = [
        { key: 'One', value: 'One' },
        { key: 'Two', value: 'Two' },
        { key: 'Three', value: 'Three' },
        { key: 'More!', value: 'More!' }
    ]

    componentDidMount() {

        // Updating User information
        let userData = window.updateCurrentUserDetail()
        userData.then(data => {
            this.setState({
                userInfo: data
            })
        })

        // Updating registry information
        let registryData = window.getRegistry()
        registryData.then(data => {
            this.setState({
                registry: data,
                registrySearched: true
            })
        })
    }

    // REGISTRY DETAIL
    copyRegistryUrl = (ev) => {
        ev.preventDefault();
        const el = document.createElement('textarea');
        el.value = `${REGISTRY_PAGE}${this.state.registryLink}`;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        toast("Copied to clipboard");
    }

    validRegistryData = () => {
        let errors = {};
        let valid = true;

        if (this.state.registryName.length <= 0) {
            errors['registryName'] = "Registry name cannot be empty."
            valid = false
        }

        if (this.state.registryLink.length <= 0) {
            errors['registryLink'] = "Link cannot be empty."
            valid = false
        }

        this.setState({
            registryErrors: errors
        })

        return valid
    }

    // Event Handler
    editRegistryDetailClickHandler = (ev) => {
        ev.preventDefault();

        this.setState({
            registryLink: this.state.registry.urlSlug,
            registryName: this.state.registry.displayName,
            registryGreetings: this.state.registry.greeting,
            isPublic: this.state.registry.isPublic,
            editRegistryDetail: true,
            editRegistryDetailChanged: false
        })
    }

    registryNameChangeHandler = (ev) => {
        let errors = { ...this.state.registryErrors }
        if (errors.registryName) {
            delete errors.registryName
        }

        this.setState({
            registryName: ev.target.value,
            editRegistryDetailChanged: true,
            registryErrors: errors
        })
    }

    registryGreetingsChangeHandler = (ev) => {
        this.setState({
            registryGreetings: ev.target.value,
            editRegistryDetailChanged: true,
        })
    }

    registryLinkChangeHandler = (ev) => {
        let errors = { ...this.state.registryErrors }
        if (errors.registryLink) {
            delete errors.registryLink
        }

        this.setState({
            registryLink: ev.target.value,
            editRegistryDetailChanged: true,
            registryErrors: errors
        })
    }

    registryVisibilityChangeHandler = (value) => {
        this.setState({
            isPublic: value,
            editRegistryDetailChanged: true,
        })
    }

    cancelClickHandler = (ev) => {
        ev.preventDefault()

        this.setState({
            registryErrors: {},
            editRegistryDetail: false
        })
    }

    saveRegistryDetailClickHandler = () => {
        if (!this.validRegistryData()) {
            return
        }

        let reqData = {
            query: UPDATE_REGISTRY_DETAIL,
            variables: {
                registryId: this.state.registry.id,
                registryData: {
                    displayName: this.state.registryName,
                    greeting: this.state.registryGreetings,
                    isPublic: this.state.isPublic,
                    urlSlug: this.state.registryLink
                }
            }
        }

        apiGraphql(reqData).then(res => res.json())
            .then(res => {
                if (res.data && res.data.updateRegistry) {
                    this.setState({
                        registry: res.data.updateRegistry.registry,
                        registryErrors: {},
                        editRegistryDetail: false
                    })
                    toast("Registry Detail updated succesfully")
                }
                if (res.errors) {
                    for (let error of res.errors) {
                        if (error.errors && error.errors.url_slug) {
                            this.setState({
                                registryErrors: { registryLink: error.errors.url_slug }
                            })
                        }
                    }

                    console.error({ ...res.errors })
                }
            })
    }


    // CHILDREN INFO
    editChildrenClickHandler = (ev) => {
        ev.preventDefault()
        let childrenCount = this.CHILDREN_COUNT_LIST.find(option => this.state.registry && this.state.registry.childrenQuestions.numberOfChildren === option.key)
        this.setState({
            editChildrenInfo: true,
            gender: this.state.registry && this.state.registry.childrenQuestions.gender ? this.state.registry.childrenQuestions.gender : "",
            childrenCount: childrenCount ? childrenCount : {},
            dueDate: this.state.registry && this.state.registry.childrenQuestions.dueDate ? this.state.registry.childrenQuestions.dueDate : ""
        })
    }

    validChildInfo = () => {
        let errors = {}
        let valid = true

        if (!this.state.childrenCount.value) {
            errors['childrenCount'] = "This field is required"
            valid = false
        }

        if (this.state.dueDate.length <= 0) {
            errors['dueDate'] = "This field is required"
            valid = false
        }

        this.setState({
            childErrors: errors
        })

        return valid
    }

    // Returning Formated date to display
    getFormatedDate = (date) => {
        let dateOb = new Date(date)
        let returnDate = dateOb.getDate()
        let returnFullYear = dateOb.getFullYear()
        let returnMonth = dateOb.getMonth() + 1

        switch (returnMonth) {
            case 1: returnMonth = "January"
                break
            case 2: returnMonth = "Febuary"
                break
            case 3: returnMonth = "March"
                break
            case 4: returnMonth = "April"
                break
            case 5: returnMonth = "May"
                break
            case 6: returnMonth = "June"
                break
            case 7: returnMonth = "July"
                break
            case 8: returnMonth = "August"
                break
            case 9: returnMonth = "September"
                break
            case 10: returnMonth = "October"
                break
            case 11: returnMonth = "November"
                break
            case 12: returnMonth = "December"
                break
            default: break
        }

        return `${returnMonth} ${returnDate}, ${returnFullYear}`
    }

    // Event Handler
    childDueDateChangeHandler = (ev) => {
        let errors = { ...this.state.childErrors }
        if (errors.dueDate) {
            delete errors.dueDate
        }

        this.setState({
            dueDate: ev.target.value,
            editChildrenInfoChanged: true,
            childErrors: errors
        })
    }

    selectTriggerClickHandler = (parentContainerId) => {
        let parentContainer = document.getElementById(parentContainerId)
        if (parentContainer) {
            if (parentContainer.classList.contains('hide-custom-select-input')) {
                parentContainer.classList.remove('hide-custom-select-input');
            }
        }
    }

    childrenCountChangeHandler = (value, parentContainerId) => {
        let errors = { ...this.state.childErrors }
        if (errors.childrenCount) {
            delete errors.childrenCount
        }

        this.setState({
            childrenCount: value,
            editChildrenInfoChanged: true,
            childErrors: errors
        })

        let parentContainer = document.getElementById(parentContainerId)
        if (parentContainer) {
            parentContainer.classList.toggle('hide-custom-select-input');
        }
    }

    childrenNumberChangeHandler = (ev) => {
        let number = Number(ev.target.value)
        if (number && number > 0) {
            let errors = { ...this.state.childErrors }
            if (errors.numberChildren) {
                delete errors.numberChildren
            }
            this.setState({
                numberChildren: ev.target.value,
                editChildrenInfoChanged: true,
                childErrors: errors
            })
        }
    }

    childGenderChangeHandler = (value) => {
        this.setState({
            gender: value,
            editChildrenInfoChanged: true
        })
    }

    closeChildInfoEditClickHandler = (ev = null) => {
        if (ev) {
            ev.preventDefault()
        }
        this.setState({
            editChildrenInfo: false,
            childErrors: {},
            editChildrenInfoChanged: false,
            dueDate: "",
            numberChildren: "",
            gender: ""
        })
    }

    saveChildInfoClickHandler = () => {
        if (!this.validChildInfo()) {
            return
        }

        // TODO: Integrate API
        let reqData = {
            query: UPDATE_CHILDREN_INFO,
            variables: {
                registryId: this.state.registry.id,
                childrenInput: {
                    dueDate: this.state.dueDate,
                    numberOfChildren: this.state.childrenCount.key,
                    gender: this.state.gender
                }
            }
        }

        apiGraphql(reqData).then(res => res.json())
            .then(res => {
                if (res.data) {
                    if (res.data.updateRegistryChildrenQuestion && res.data.updateRegistryChildrenQuestion.childrenQuestion) {
                        toast("Child(ren) Information updated successfully")
                        let registry = { ...this.state.registry }
                        registry.childrenQuestions = res.data.updateRegistryChildrenQuestion.childrenQuestion
                        this.setState({
                            registry: registry
                        })
                        this.closeChildInfoEditClickHandler()
                    }
                } else if (res.errors) {
                    for (let error of res.errors) {
                        toast(error.message, "error")
                    }
                    console.error({ ...res.errors })
                }
            })
    }


    // PARTNER
    editPartnerInfoClickHandler = (ev) => {
        ev.preventDefault()
        this.setState({
            editPartnerInfo: true,
            partnerFirstName: this.state.userInfo && this.state.userInfo.partner ? this.state.userInfo.partner.firstName : "",
            partnerLastName: this.state.userInfo && this.state.userInfo.partner ? this.state.userInfo.partner.lastName : "",
            partnerEmail: this.state.userInfo && this.state.userInfo.partner ? this.state.userInfo.partner.email : "",
            partnerErrors: {},
            partnerInputChanged: false,
        })
    }

    validPartnerDetail = () => {
        let errors = {}
        let valid = true

        if (this.state.partnerFirstName.length <= 0) {
            errors['partnerFirstName'] = "This field is mandatory"
            valid = false
        }

        if (this.state.partnerLastName.length <= 0) {
            errors['partnerLastName'] = "This field is mandatory"
            valid = false
        }

        if (this.state.partnerEmail.length <= 0) {
            errors['partnerEmail'] = "This field is mandatory"
            valid = false
        } else if (!this.state.partnerEmail.match(this.EMAIL_RE)) {
            errors['partnerEmail'] = "Invalid Email address"
            valid = false;
        }

        this.setState({
            partnerErrors: errors
        })

        return valid
    }

    // Event Handler
    partnerFirstNameChangeHandler = (ev) => {
        if (ev.target.value.match(this.ALPHABET) || ev.target.value.length <= 0) {
            let errors = { ...this.state.partnerErrors }
            if (errors.partnerFirstName) {
                delete errors.partnerFirstName
            }

            this.setState({
                partnerFirstName: ev.target.value,
                partnerErrors: errors,
                partnerInputChanged: true
            })
        }
    }

    partnerLastNameChangeHandler = (ev) => {
        if (ev.target.value.match(this.ALPHABET) || ev.target.value.length <= 0) {
            let errors = { ...this.state.partnerErrors }
            if (errors.partnerLastName) {
                delete errors.partnerLastName
            }

            this.setState({
                partnerLastName: ev.target.value,
                partnerErrors: errors,
                partnerInputChanged: true
            })
        }
    }

    partnerEmailChangeHandler = (ev) => {
        let errors = { ...this.state.partnerErrors }
        if (errors.partnerEmail) {
            delete errors.partnerEmail
        }

        this.setState({
            partnerEmail: ev.target.value,
            partnerErrors: errors,
            partnerInputChanged: true
        })
    }

    partnerCancelClickHandler = (ev) => {
        ev.preventDefault()
        this.setState({
            editPartnerInfo: false
        })
    }

    savePartnerDetailClickHandler = () => {
        if (!this.validPartnerDetail()) {
            return false
        }

        if (this.state.userInfo) {
            if (this.state.userInfo.partner) {
                // Call Update API
                let reqData = {
                    query: window.UPDATE_PARTNER_ACCOUNT,
                    variables: {
                        updateInput: {
                            email: this.state.partnerEmail,
                            firstName: this.state.partnerFirstName,
                            lastName: this.state.partnerLastName,
                        }
                    }
                }

                apiGraphql(reqData).then(res => res.json())
                    .then(res => {
                        if (res.data) {
                            if (res.data.udpatePartnerAccount) {
                                let userInfo = { ...this.state.userInfo }
                                userInfo.partner = res.data.udpatePartnerAccount.partnerAccount
                                this.setState({
                                    userInfo: userInfo,
                                    editPartnerInfo: false
                                })
                                toast("Partner account updated successfully")
                            }
                        } else if (res.errors) {
                            for (let error of res.errors) {
                                toast(error.message, "error")
                            }
                            console.log({ ...res.errors })
                        }
                    })
            } else {
                // Call Add API
                let reqData = {
                    query: window.ADD_PARTNER_ACCOUNT,
                    variables: {
                        partnerInput: {
                            email: this.state.partnerEmail,
                            name: `${this.state.partnerFirstName} ${this.state.partnerLastName}`
                        }
                    }
                }

                apiGraphql(reqData).then(res => res.json())
                    .then(res => {
                        if (res.data) {
                            if (res.data.addPartnerAccount) {
                                let userInfo = { ...this.state.userInfo }
                                userInfo.partner = res.data.addPartnerAccount.partnerAccount
                                this.setState({
                                    userInfo: userInfo,
                                    editPartnerInfo: false
                                })
                                toast("Partner account added successfully")
                            }
                        } else if (res.errors) {
                            for (let error of res.errors) {
                                toast(error.message, "error")
                            }
                            console.log({ ...res.errors })
                        }
                    })
            }
        }
    }

    partnerResendEmailClickHandler = (ev) => {
        ev.preventDefault()
        let reqData = {
            query: window.RESEND_INVITATION_EMAIL
        }

        apiGraphql(reqData).then(res => res.json())
            .then(res => {
                if (res.data) {
                    if (res.data.resendPartnerInvite) {
                        toast("Invitation mail sent successfully")
                    }
                } else if (res.errors) {
                    for (let error of res.errors) {
                        toast(error.message, "error")
                    }
                    console.log({ ...res.errors })
                }
            })
    }

    removePartnerAccount = () => {
        let reqData = {
            query: window.REMOVE_PARTNER_ACCOUNT
        }

        apiGraphql(reqData).then(res => res.json())
            .then(res => {
                if (res.data) {
                    if (res.data.removePartnerAccount) {
                        let userInfo = { ...this.state.userInfo }
                        userInfo.partner = null
                        this.setState({
                            userInfo: userInfo
                        })
                        toast("Partner account removed successfully", "error")
                    }
                } else if (res.errors) {
                    for (let error of res.errors) {
                        toast(error.message, "error")
                    }
                    console.log({ ...res.errors })
                }
            })
    }

    removePartnerClickHandler = (ev) => {
        ev.preventDefault()
        this.setState({
            partnerRemoveConfirmModal: true
        })
    }

    render() {
        if (!this.state.registry && this.state.registrySearched) {
            return (
                <h1>No Registry</h1>
            )
        } else {
            return (
                <div className="settings-registry-detail">
                    {/* Registry Detail */}
                    <div className="registry-detail-section">
                        <div className="settings-component-headers">
                            <h3 className="d-inline-block mr-1">Registry Details</h3>
                            {!this.state.editRegistryDetail ? <a href="#" onClick={(ev) => this.editRegistryDetailClickHandler(ev)} className="settings-link text-sm font-medium">Edit</a> : null}
                        </div>
                        {this.state.editRegistryDetail && this.state.registry.id ?
                            <div className="edit-registry-detail">

                                <div className="row">
                                    <div className="col-7">
                                        <div className="settings-input-container">
                                            <label className="settings-input-label settings-input-required text-sm font-medium m-0">Registry Name</label>
                                            <input
                                                className={["settings-input text-body mw-100 w-100 mb-0", this.state.registryErrors.registryName ? 'settings-input-error' : ''].join(" ")}
                                                value={this.state.registryName}
                                                onChange={(ev) => this.registryNameChangeHandler(ev)}
                                                type="text"
                                                name="registry-name" />
                                            {this.state.registryErrors.registryName ?
                                                <label className="settings-input-error-message text-sm m-0">{this.state.registryErrors.registryName}</label>
                                                : null}
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-7">
                                        <div className="settings-input-container input-container-margin">
                                            <label className="settings-input-label text-sm font-medium m-0">Add Greeting</label>
                                            <textarea
                                                className="settings-textarea text-body mw-100 w-100"
                                                placeholder="Write a greeting for your guests"
                                                value={this.state.registryGreetings}
                                                name="greeting"
                                                onChange={(ev) => this.registryGreetingsChangeHandler(ev)}
                                                rows={2} />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-10">
                                        <div className="settings-input-container input-container-margin">
                                            <label className="settings-input-label settings-input-required text-sm font-medium m-0">Link</label>
                                            <div className={["settings-input-registry-link-section", this.state.registryErrors.registryLink ? 'settings-input-error' : ''].join(" ")}>
                                                <input
                                                    className={["settings-input-registry-link text-body d-inline-block mb-0"].join(" ")}
                                                    value={REGISTRY_PAGE}
                                                    disabled={true}
                                                    type="text" />
                                                <input
                                                    className={["settings-input-registry-link text-body mb-0 d-inline-block"].join(" ")}
                                                    value={this.state.registryLink}
                                                    onChange={(ev) => this.registryLinkChangeHandler(ev)}
                                                    type="text"
                                                    name="registry-link" />
                                            </div>
                                            {this.state.registryErrors.registryLink ?
                                                <label className="settings-input-error-message text-sm m-0">{this.state.registryErrors.registryLink}</label>
                                                : null}
                                        </div>
                                    </div>
                                    <div className="col">
                                        <a className="d-block settings-link text-body font-medium registry-detail-url-copy-link" href="#" onClick={(ev) => this.copyRegistryUrl(ev)}>Copy</a>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-7">
                                        <div className="settings-input-container input-container-margin">
                                            <label className="settings-input-label text-sm font-medium m-0">Status</label>
                                            <div>
                                                <RadioButton
                                                    className="settings-radio-input"
                                                    checked={!this.state.isPublic}
                                                    changeHandler={() => this.registryVisibilityChangeHandler(false)}
                                                >
                                                    <div>
                                                        <p className="text-body">Secret</p>
                                                        <p className="mt-1 text-sm">Keep your registry private for now.</p>
                                                    </div>
                                                </RadioButton>

                                                <RadioButton
                                                    className="settings-radio-input"
                                                    checked={this.state.isPublic}
                                                    changeHandler={() => this.registryVisibilityChangeHandler(true)}
                                                >
                                                    <div>
                                                        <p className="text-body">Visible</p>
                                                        <p className="mt-1 text-sm">Make your registry available to guests.</p>
                                                    </div>
                                                </RadioButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col settings-edit-footer-section">
                                        <Button
                                            className="settings-edit-footer-button text-body font-medium"
                                            onClick={this.saveRegistryDetailClickHandler}
                                            disabled={!this.state.editRegistryDetailChanged || Object.keys(this.state.registryErrors).length > 0}
                                        >Save</Button>
                                        <a href="#" className="settings-link text-body font-medium settings-edit-footer-cancel" onClick={(ev) => this.cancelClickHandler(ev)}>Cancel</a>
                                    </div>
                                </div>
                            </div>
                            :
                            <div>
                                <div className="row">
                                    <div className="col-3">
                                        <p className="text-sm font-medium">Registry Name</p>
                                    </div>
                                    <div className="col">
                                        <p className="text-sm">{this.state.registry && this.state.registry.displayName ? this.state.registry.displayName : ''}</p>
                                    </div>
                                </div>

                                <div className="row mt-2">
                                    <div className="col-3">
                                        <p className="text-sm font-medium">Greetings</p>
                                    </div>
                                    <div className="col">
                                        {this.state.registry ?
                                            this.state.registry.greeting ?
                                                <p className="text-sm">{this.state.registry.greeting}</p>
                                                :
                                                <a href="#" className="settings-link text-sm d-block" onClick={(ev) => this.editRegistryDetailClickHandler(ev)}>Add</a>
                                            : null}
                                    </div>
                                </div>

                                <div className="row mt-2">
                                    <div className="col-3">
                                        <p className="text-sm font-medium">Link / URL</p>
                                    </div>
                                    <div className="col">
                                        <p className="text-sm">{this.state.registry && this.state.registry.urlSlug ? `${window.REGISTRY_PAGE}${this.state.registry.urlSlug}` : ''}</p>
                                    </div>
                                </div>

                                <div className="row mt-2">
                                    <div className="col-3">
                                        <p className="text-sm font-medium">Status</p>
                                    </div>
                                    <div className="col">
                                        <p className="text-sm">{this.state.registry && this.state.registry.isPublic ? 'Visible' : 'Secret'}</p>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>

                    {/* Children */}
                    <div className="registry-children-section">
                        <div className="settings-component-headers">
                            <h3 className="d-inline-block mr-1">Chile(ren)</h3>
                            {!this.state.editChildrenInfo ? <a href="#" onClick={(ev) => this.editChildrenClickHandler(ev)} className="settings-link text-sm font-medium">Edit</a> : null}
                        </div>

                        {this.state.editChildrenInfo ?
                            <div className="edit-children-info">
                                <div className="row">
                                    <div className="col-7">
                                        <div className="settings-input-container">
                                            <label className="settings-input-label text-sm font-medium m-0">Due Date</label>
                                            <input
                                                className={["settings-input text-body mw-100 w-100", this.state.childErrors.dueDate ? 'settings-input-error' : ''].join(" ")}
                                                value={this.state.dueDate}
                                                onChange={(ev) => this.childDueDateChangeHandler(ev)}
                                                type="date"
                                                name="due-date" />
                                            {this.state.childErrors.dueDate ?
                                                <label className="settings-input-error-message text-sm m-0">{this.state.childErrors.dueDate}</label>
                                                : null}
                                        </div>
                                    </div>
                                    <div className="col-3">
                                        <div className="settings-input-container">
                                            <label className="settings-input-label text-sm font-medium m-0">No. of Children</label>
                                            <div className="custom-select-input">
                                                <button className={["custom-select-trigger w-100 text-left", this.state.childErrors.childrenCount ? 'settings-input-error' : ''].join(' ')} onClick={() => this.selectTriggerClickHandler("childCountSelectContainer")}>{this.state.childrenCount.value ? this.state.childrenCount.value : "Select No. of Children"}</button>
                                                <div className="custom-select-container" id="childCountSelectContainer">
                                                    <ul className="custom-select-lists w-100 p-0">
                                                        {this.CHILDREN_COUNT_LIST.map(option => (
                                                            <li onClick={() => this.childrenCountChangeHandler(option, "childCountSelectContainer")}>{option.value}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                            {this.state.childErrors.childrenCount ?
                                                <label className="settings-input-error-message text-sm m-0">{this.state.childErrors.childrenCount}</label>
                                                : null}
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-7">
                                        <div className="settings-input-container input-container-margin">
                                            <label className="settings-input-label text-sm font-medium m-0">Gender</label>
                                            <div>
                                                <RadioButton
                                                    className="settings-radio-input"
                                                    checked={this.state.gender && this.state.gender === "Boy"}
                                                    changeHandler={() => this.childGenderChangeHandler("Boy")}
                                                >
                                                    <div>
                                                        <p className="text-body">Boy</p>
                                                    </div>
                                                </RadioButton>

                                                <RadioButton
                                                    className="settings-radio-input"
                                                    checked={this.state.gender && this.state.gender === "Girl"}
                                                    changeHandler={() => this.childGenderChangeHandler("Girl")}
                                                >
                                                    <div>
                                                        <p className="text-body">Girl</p>
                                                    </div>
                                                </RadioButton>

                                                <RadioButton
                                                    className="settings-radio-input"
                                                    checked={false}
                                                    checked={this.state.gender && this.state.gender === "Both"}
                                                    changeHandler={() => this.childGenderChangeHandler("Both")}
                                                >
                                                    <div>
                                                        <p className="text-body">Both</p>
                                                    </div>
                                                </RadioButton>

                                                <RadioButton
                                                    className="settings-radio-input"
                                                    checked={this.state.gender && this.state.gender === "It’s a surprise!"}
                                                    changeHandler={() => this.childGenderChangeHandler("It’s a surprise!")}
                                                >
                                                    <div>
                                                        <p className="text-body">It’s a surprise!</p>
                                                    </div>
                                                </RadioButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col settings-edit-footer-section">
                                        <Button
                                            className="settings-edit-footer-button text-body font-medium"
                                            onClick={this.saveChildInfoClickHandler}
                                            disabled={!this.state.editChildrenInfoChanged || Object.keys(this.state.childErrors).length > 0}
                                        >Save</Button>
                                        <a href="#" className="settings-link text-body font-medium settings-edit-footer-cancel" onClick={(ev) => this.closeChildInfoEditClickHandler(ev)}>Cancel</a>
                                    </div>
                                </div>

                            </div>
                            :
                            <div>
                                <div className="row">
                                    <div className="col-3">
                                        <p className="text-sm font-medium">Due Date</p>
                                    </div>
                                    <div className="col">
                                        <p className="text-sm">{this.state.registry && this.state.registry.childrenQuestions.dueDate ? this.getFormatedDate(this.state.registry.childrenQuestions.dueDate) : ""}</p>
                                    </div>
                                </div>

                                <div className="row mt-2">
                                    <div className="col-3">
                                        <p className="text-sm font-medium">No. of children</p>
                                    </div>
                                    <div className="col">
                                        <p className="text-sm">{this.state.registry && this.state.registry.childrenQuestions.numberOfChildren ? this.state.registry.childrenQuestions.numberOfChildren : ""}</p>
                                    </div>
                                </div>

                                <div className="row mt-2">
                                    <div className="col-3">
                                        <p className="text-sm font-medium">Gender</p>
                                    </div>
                                    <div className="col">
                                        <p className="text-sm">{this.state.registry && this.state.registry.childrenQuestions.gender ? this.state.registry.childrenQuestions.gender : ""}</p>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>

                    <div className="registry-partner-section">
                        <div className="settings-component-headers">
                            <h3 className="d-inline-block mr-1">Partner</h3>
                            {!this.state.editPartnerInfo && (this.state.userInfo && this.state.userInfo.partner && this.state.userInfo.partner.accountState === "INVITED") ? <a href="#" onClick={(ev) => this.editPartnerInfoClickHandler(ev)} className="settings-link text-sm font-medium mr-2">Edit</a> : null}
                            {!this.state.editPartnerInfo && (this.state.userInfo && this.state.userInfo.partner) ? <a href="#" onClick={(ev) => this.removePartnerClickHandler(ev)} className="settings-link text-sm font-medium">Remove</a> : null}
                            {this.state.userInfo && this.state.userInfo.partner === null && !this.state.editPartnerInfo ?
                                <a href="#" onClick={(ev) => this.editPartnerInfoClickHandler(ev)} className="mt-3 d-block settings-link text-body font-medium">Add Partner</a>
                                : null}
                        </div>

                        {this.state.editPartnerInfo ?
                            <div className="partner-info-edit">

                                <div className="row">
                                    <div className="col-6">
                                        <div className="settings-input-container">
                                            <label className="settings-input-label settings-input-required text-sm font-medium m-0">First Name</label>
                                            <input
                                                className={["settings-input text-body mw-100 w-100 mb-0", this.state.partnerErrors.partnerFirstName ? 'settings-input-error' : ''].join(" ")}
                                                value={this.state.partnerFirstName}
                                                onChange={(ev) => this.partnerFirstNameChangeHandler(ev)}
                                                type="text"
                                                name="first-name" />
                                            {this.state.partnerErrors.partnerFirstName ?
                                                <label className="settings-input-error-message text-sm m-0">{this.state.partnerErrors.partnerFirstName}</label>
                                                : null}
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="settings-input-container">
                                            <label className="settings-input-label settings-input-required text-sm font-medium m-0">Last Name</label>
                                            <input
                                                className={["settings-input text-body mw-100 w-100 mb-0", this.state.partnerErrors.partnerLastName ? 'settings-input-error' : ''].join(" ")}
                                                value={this.state.partnerLastName}
                                                onChange={(ev) => this.partnerLastNameChangeHandler(ev)}
                                                type="text"
                                                name="last-name" />
                                            {this.state.partnerErrors.partnerLastName ?
                                                <label className="settings-input-error-message text-sm m-0">{this.state.partnerErrors.partnerLastName}</label>
                                                : null}
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-6">
                                        <div className="settings-input-container input-container-margin">
                                            <label className="settings-input-label settings-input-required text-sm font-medium m-0">Email</label>
                                            <input
                                                className={["settings-input text-body mw-100 w-100 mb-0", this.state.partnerErrors.partnerEmail ? 'settings-input-error' : ''].join(" ")}
                                                value={this.state.partnerEmail}
                                                onChange={(ev) => this.partnerEmailChangeHandler(ev)}
                                                type="text"
                                                name="email" />
                                            {this.state.partnerErrors.partnerEmail ?
                                                <label className="settings-input-error-message text-sm m-0">{this.state.partnerErrors.partnerEmail}</label>
                                                : null}
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col settings-edit-footer-section">
                                        <Button
                                            className="settings-edit-footer-button text-body font-medium"
                                            onClick={this.savePartnerDetailClickHandler}
                                            disabled={!this.state.partnerInputChanged || Object.keys(this.state.partnerErrors).length > 0}
                                        >Save</Button>
                                        <a href="#" className="settings-link text-body font-medium settings-edit-footer-cancel" onClick={(ev) => this.partnerCancelClickHandler(ev)}>Cancel</a>
                                    </div>
                                </div>
                            </div>
                            :
                            this.state.userInfo.partner ?
                                <div>
                                    <div className="row">
                                        <div className="col-3">
                                            <p className="text-sm font-medium">Name</p>
                                        </div>
                                        <div className="col">
                                            <p className="text-sm">{this.state.userInfo && this.state.userInfo.partner ? `${this.state.userInfo.partner.firstName} ${this.state.userInfo.partner.lastName}` : ""}</p>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-3">
                                            <p className="text-sm font-medium">Email</p>
                                        </div>
                                        <div className="col">
                                            <p className="text-sm">{this.state.userInfo && this.state.userInfo.partner ? this.state.userInfo.partner.email : ""}</p>
                                        </div>
                                    </div>
                                    {this.state.userInfo && this.state.userInfo.partner && this.state.userInfo.partner.accountState === "INVITED" ?
                                        <div className="row mt-2">
                                            <div className="col">
                                                <span className="partner-invitation-pending-pill text-sm font-medium d-inline-block mr-3">Invitation Pending</span>
                                                <a href="#" className="settings-link text-sm font-medium" onClick={(ev) => this.partnerResendEmailClickHandler(ev)}>Resend Email</a>
                                            </div>
                                        </div>
                                        : null}
                                </div>
                                : null
                        }
                        {this.state.partnerRemoveConfirmModal ?
                            <ModalComponent
                                show={this.state.partnerRemoveConfirmModal}
                                size="md"
                                closeModal={() => this.setState({ partnerRemoveConfirmModal: false })}
                                footer={
                                    <div>
                                        <Button
                                            variant="secondary"
                                            onClick={() => this.setState({ partnerRemoveConfirmModal: false })}
                                            className="partner-account-remove-button text-body font-medium mr-2"
                                        >Do Not Remove</Button>

                                        <Button
                                            variant="primary"
                                            onClick={() => { this.removePartnerAccount(); this.setState({ partnerRemoveConfirmModal: false }) }}
                                            className="partner-account-remove-button text-body font-medium"
                                        >Yes, Please Remove</Button>
                                    </div>
                                }
                            >
                                <h2>Are you sure you want remove Partner Account?</h2>
                            </ModalComponent>
                            : null}
                    </div>
                </div>
            )
        }
    }
}

class BankDetail extends React.Component {
    DIGIT = /^[0-9]*$/g
    ALPHABET = /^[A-Za-z]+$/g
    // To watch input change handler
    PHONE_WITH_COUNTRY_CODE = /^\+\d{0,11}$/g
    PHONE_WITHOUT_COUNTRY_CODE = /^\d{0,10}$/g

    // To validate complete phone number
    PHONE_WITH_COUNTRY_CODE_COMPLETE = /^\+\d{11}$/g
    PHONE_WITHOUT_COUNTRY_CODE_COMPLETE = /^\d{10}$/g

    MIN_ACCOUNT_NUMBER_LENGTH = 4
    MAX_ACCOUNT_NUMBER_LENGTH = 17
    ROUTING_NUMBER_LENGTH = 9
    PIN_CODE_LENGTH = 5

    state = {
        registry: null,
        bankAccount: null,
        registrySearched: false,
        showConfirmRemoveModal: false,
        // TODO: Update terms and condition
        termsCondition: `Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Sed porttitor lectus nibh. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Vivamus suscipit tortor eget felis porttitor volutpat. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget tortor risus. Pellentesque in ipsum id orci porta dapibus. Nulla quis lorem ut libero malesuada feugiat. Quisque velit nisi, pretium ut lacinia in, elementum id enim. Pellentesque in ipsum id orci porta dapibus. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Curabitur aliquet quam id dui posuere blandit.`,
        editBankAccount: false,
        enableSaveButton: false,
        bankAccountErrors: {},
        accountType: {},
        routingNumber: "",
        accountNumber: "",
        confirmAccountNumber: "",
        firstName: "",
        lastName: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        country: {
            "countryName": "United States of America",
            "countryShortCode": "US",
        },
        stateProvince: {},
        postalCode: "",
        phone: "",
        dateOfBirth: "",
        termsAccepted: false,
    }

    // List of Country and Province
    countryRegionList = [
        {
            "countryName": "United States of America",
            "countryShortCode": "US",
            "regions": [{
                "name": "Alabama",
                "shortCode": "AL"
            },
            {
                "name": "Alaska",
                "shortCode": "AK"
            },
            {
                "name": "American Samoa",
                "shortCode": "AS"
            },
            {
                "name": "Arizona",
                "shortCode": "AZ"
            },
            {
                "name": "Arkansas",
                "shortCode": "AR"
            },
            {
                "name": "California",
                "shortCode": "CA"
            },
            {
                "name": "Colorado",
                "shortCode": "CO"
            },
            {
                "name": "Connecticut",
                "shortCode": "CT"
            },
            {
                "name": "Delaware",
                "shortCode": "DE"
            },
            {
                "name": "District of Columbia",
                "shortCode": "DC"
            },
            {
                "name": "Micronesia",
                "shortCode": "FM"
            },
            {
                "name": "Florida",
                "shortCode": "FL"
            },
            {
                "name": "Georgia",
                "shortCode": "GA"
            },
            {
                "name": "Guam",
                "shortCode": "GU"
            },
            {
                "name": "Hawaii",
                "shortCode": "HI"
            },
            {
                "name": "Idaho",
                "shortCode": "ID"
            },
            {
                "name": "Illinois",
                "shortCode": "IL"
            },
            {
                "name": "Indiana",
                "shortCode": "IN"
            },
            {
                "name": "Iowa",
                "shortCode": "IA"
            },
            {
                "name": "Kansas",
                "shortCode": "KS"
            },
            {
                "name": "Kentucky",
                "shortCode": "KY"
            },
            {
                "name": "Louisiana",
                "shortCode": "LA"
            },
            {
                "name": "Maine",
                "shortCode": "ME"
            },
            {
                "name": "Marshall Islands",
                "shortCode": "MH"
            },
            {
                "name": "Maryland",
                "shortCode": "MD"
            },
            {
                "name": "Massachusetts",
                "shortCode": "MA"
            },
            {
                "name": "Michigan",
                "shortCode": "MI"
            },
            {
                "name": "Minnesota",
                "shortCode": "MN"
            },
            {
                "name": "Mississippi",
                "shortCode": "MS"
            },
            {
                "name": "Missouri",
                "shortCode": "MO"
            },
            {
                "name": "Montana",
                "shortCode": "MT"
            },
            {
                "name": "Nebraska",
                "shortCode": "NE"
            },
            {
                "name": "Nevada",
                "shortCode": "NV"
            },
            {
                "name": "New Hampshire",
                "shortCode": "NH"
            },
            {
                "name": "New Jersey",
                "shortCode": "NJ"
            },
            {
                "name": "New Mexico",
                "shortCode": "NM"
            },
            {
                "name": "New York",
                "shortCode": "NY"
            },
            {
                "name": "North Carolina",
                "shortCode": "NC"
            },
            {
                "name": "North Dakota",
                "shortCode": "ND"
            },
            {
                "name": "Northern Mariana Islands",
                "shortCode": "MP"
            },
            {
                "name": "Ohio",
                "shortCode": "OH"
            },
            {
                "name": "Oklahoma",
                "shortCode": "OK"
            },
            {
                "name": "Oregon",
                "shortCode": "OR"
            },
            {
                "name": "Palau",
                "shortCode": "PW"
            },
            {
                "name": "Pennsylvania",
                "shortCode": "PA"
            },
            {
                "name": "Puerto Rico",
                "shortCode": "PR"
            },
            {
                "name": "Rhode Island",
                "shortCode": "RI"
            },
            {
                "name": "South Carolina",
                "shortCode": "SC"
            },
            {
                "name": "South Dakota",
                "shortCode": "SD"
            },
            {
                "name": "Tennessee",
                "shortCode": "TN"
            },
            {
                "name": "Texas",
                "shortCode": "TX"
            },
            {
                "name": "Utah",
                "shortCode": "UT"
            },
            {
                "name": "Vermont",
                "shortCode": "VT"
            },
            {
                "name": "Virgin Islands",
                "shortCode": "VI"
            },
            {
                "name": "Virginia",
                "shortCode": "VA"
            },
            {
                "name": "Washington",
                "shortCode": "WA"
            },
            {
                "name": "West Virginia",
                "shortCode": "WV"
            },
            {
                "name": "Wisconsin",
                "shortCode": "WI"
            },
            {
                "name": "Wyoming",
                "shortCode": "WY"
            },
            {
                "name": "Armed Forces Americas",
                "shortCode": "AA"
            },
            {
                "name": "Armed Forces Europe, Canada, Africa and Middle East",
                "shortCode": "AE"
            },
            {
                "name": "Armed Forces Pacific",
                "shortCode": "AP"
            }
            ]
        }
    ]

    // Bank Account Type
    bankAccountType = [
        { value: "CHECKING", label: "Checking", backendValue: "checking" },
        { value: "SAVINGS", label: "Savings", backendValue: "savings" },
        { value: "GENERAL_LEDGER", label: "General ledger", backendValue: "general-ledger" },
        { value: "LOAN", label: "Loan", backendValue: "loan" }
    ]

    countryRegionList = [
        {
            "countryName": "United States of America",
            "countryShortCode": "US",
            "regions": [{
                "name": "Alabama",
                "shortCode": "AL"
            },
            {
                "name": "Alaska",
                "shortCode": "AK"
            },
            {
                "name": "American Samoa",
                "shortCode": "AS"
            },
            {
                "name": "Arizona",
                "shortCode": "AZ"
            },
            {
                "name": "Arkansas",
                "shortCode": "AR"
            },
            {
                "name": "California",
                "shortCode": "CA"
            },
            {
                "name": "Colorado",
                "shortCode": "CO"
            },
            {
                "name": "Connecticut",
                "shortCode": "CT"
            },
            {
                "name": "Delaware",
                "shortCode": "DE"
            },
            {
                "name": "District of Columbia",
                "shortCode": "DC"
            },
            {
                "name": "Micronesia",
                "shortCode": "FM"
            },
            {
                "name": "Florida",
                "shortCode": "FL"
            },
            {
                "name": "Georgia",
                "shortCode": "GA"
            },
            {
                "name": "Guam",
                "shortCode": "GU"
            },
            {
                "name": "Hawaii",
                "shortCode": "HI"
            },
            {
                "name": "Idaho",
                "shortCode": "ID"
            },
            {
                "name": "Illinois",
                "shortCode": "IL"
            },
            {
                "name": "Indiana",
                "shortCode": "IN"
            },
            {
                "name": "Iowa",
                "shortCode": "IA"
            },
            {
                "name": "Kansas",
                "shortCode": "KS"
            },
            {
                "name": "Kentucky",
                "shortCode": "KY"
            },
            {
                "name": "Louisiana",
                "shortCode": "LA"
            },
            {
                "name": "Maine",
                "shortCode": "ME"
            },
            {
                "name": "Marshall Islands",
                "shortCode": "MH"
            },
            {
                "name": "Maryland",
                "shortCode": "MD"
            },
            {
                "name": "Massachusetts",
                "shortCode": "MA"
            },
            {
                "name": "Michigan",
                "shortCode": "MI"
            },
            {
                "name": "Minnesota",
                "shortCode": "MN"
            },
            {
                "name": "Mississippi",
                "shortCode": "MS"
            },
            {
                "name": "Missouri",
                "shortCode": "MO"
            },
            {
                "name": "Montana",
                "shortCode": "MT"
            },
            {
                "name": "Nebraska",
                "shortCode": "NE"
            },
            {
                "name": "Nevada",
                "shortCode": "NV"
            },
            {
                "name": "New Hampshire",
                "shortCode": "NH"
            },
            {
                "name": "New Jersey",
                "shortCode": "NJ"
            },
            {
                "name": "New Mexico",
                "shortCode": "NM"
            },
            {
                "name": "New York",
                "shortCode": "NY"
            },
            {
                "name": "North Carolina",
                "shortCode": "NC"
            },
            {
                "name": "North Dakota",
                "shortCode": "ND"
            },
            {
                "name": "Northern Mariana Islands",
                "shortCode": "MP"
            },
            {
                "name": "Ohio",
                "shortCode": "OH"
            },
            {
                "name": "Oklahoma",
                "shortCode": "OK"
            },
            {
                "name": "Oregon",
                "shortCode": "OR"
            },
            {
                "name": "Palau",
                "shortCode": "PW"
            },
            {
                "name": "Pennsylvania",
                "shortCode": "PA"
            },
            {
                "name": "Puerto Rico",
                "shortCode": "PR"
            },
            {
                "name": "Rhode Island",
                "shortCode": "RI"
            },
            {
                "name": "South Carolina",
                "shortCode": "SC"
            },
            {
                "name": "South Dakota",
                "shortCode": "SD"
            },
            {
                "name": "Tennessee",
                "shortCode": "TN"
            },
            {
                "name": "Texas",
                "shortCode": "TX"
            },
            {
                "name": "Utah",
                "shortCode": "UT"
            },
            {
                "name": "Vermont",
                "shortCode": "VT"
            },
            {
                "name": "Virgin Islands",
                "shortCode": "VI"
            },
            {
                "name": "Virginia",
                "shortCode": "VA"
            },
            {
                "name": "Washington",
                "shortCode": "WA"
            },
            {
                "name": "West Virginia",
                "shortCode": "WV"
            },
            {
                "name": "Wisconsin",
                "shortCode": "WI"
            },
            {
                "name": "Wyoming",
                "shortCode": "WY"
            },
            {
                "name": "Armed Forces Americas",
                "shortCode": "AA"
            },
            {
                "name": "Armed Forces Europe, Canada, Africa and Middle East",
                "shortCode": "AE"
            },
            {
                "name": "Armed Forces Pacific",
                "shortCode": "AP"
            }
            ]
        }
    ]

    mandatoryFields = [
        'routingNumber',
        'accountNumber',
        'confirmAccountNumber',
        'firstName',
        'lastName',
        'addressLine1',
        'city',
        'postalCode',
        'phone',
        'dateOfBirth',
    ]

    getClearState = () => {
        return {
            editBankAccount: true,
            enableSaveButton: false,
            bankAccountErrors: {},
            accountType: {},
            routingNumber: "",
            accountNumber: "",
            confirmAccountNumber: "",
            firstName: "",
            lastName: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            country: {
                "countryName": "United States of America",
                "countryShortCode": "US",
            },
            stateProvince: {},
            postalCode: "",
            phone: "",
            dateOfBirth: "",
            termsAccepted: false
        }
    }

    componentDidMount() {
        let currentUser = window.updateCurrentUserDetail()
        currentUser.then(res => {
            // Getting Bank account of current user
            this.setState({
                bankAccount: res.bankAccounts.length > 0 ? [res.bankAccounts[0]] : []
            })
        })

        let registryData = window.getRegistry()
        registryData.then(data => {
            this.setState({
                registry: data,
                registrySearched: true
            })
        })
    }

    getCountry = (countryName) => {
        let country = this.countryRegionList.find(el => el.countryName === countryName)
        if (country && country.regions) {
            country = { ...country }
            delete country.regions
        }
        return country
    }

    getAccountType = (typeName) => {
        let type = this.bankAccountType.find(el => el.value === typeName)
        return type ? type : {}
    }

    checkForSaveBtnState = () => {
        let enableSave = false;
        if (
            this.state.firstName.length > 0 &&
            this.state.lastName.length > 0 &&
            this.state.accountType.value &&
            this.state.routingNumber.length > 0 &&
            this.state.accountNumber.length > 0 &&
            this.state.confirmAccountNumber.length > 0 &&
            this.state.addressLine1.length > 0 &&
            this.state.city.length > 0 &&
            this.state.stateProvince.name &&
            this.state.postalCode.length > 0 &&
            this.state.phone.length > 0 &&
            this.state.dateOfBirth.length > 0 &&
            this.state.termsAccepted
        ) {
            enableSave = true
        }
        this.setState({
            enableSaveButton: enableSave
        })
    }

    validData = () => {
        let errors = {}
        let valid = true

        // TODO: Confirm current field validations

        for (let field of this.mandatoryFields) {
            if (this.state[field].length <= 0) {
                errors[field] = 'This is field is mandatory';
                valid = false
            }
        }

        if (this.state.phone.length > 0 && !(this.state.phone.match(this.PHONE_WITHOUT_COUNTRY_CODE_COMPLETE) || this.state.phone.match(this.PHONE_WITH_COUNTRY_CODE_COMPLETE))) {
            errors['phone'] = 'Invalid phone number';
            valid = false
        }

        if (this.state.routingNumber.length > 0 && this.state.routingNumber.length != this.ROUTING_NUMBER_LENGTH) {
            errors['routingNumber'] = 'Invalid routing number';
            valid = false
        }

        if (this.state.accountNumber.length > 0 && (this.state.accountNumber.length < this.MIN_ACCOUNT_NUMBER_LENGTH || this.state.accountNumber.length > this.MAX_ACCOUNT_NUMBER_LENGTH)) {
            errors['accountNumber'] = 'Invalid account number';
            valid = false
        }

        if (this.state.postalCode.length > 0 && this.state.postalCode.length != this.PIN_CODE_LENGTH) {
            errors['postalCode'] = 'Invalid postal code';
            valid = false
        }

        if (!this.state.termsAccepted) {
            errors['termsAccepted'] = 'Please accept terms and conditions.';
            valid = false
        }

        if (!this.state.stateProvince.name) {
            errors['stateProvince'] = 'This is field is mandatory';
            valid = false
        }

        if (!this.state.accountType.value) {
            errors['accountType'] = 'This is field is mandatory';
            valid = false
        }

        if (this.state.accountNumber.length > 0 && this.state.confirmAccountNumber.length > 0 && this.state.accountNumber !== this.state.confirmAccountNumber) {
            errors['confirmAccountNumber'] = 'Account number is not matching';
            valid = false
        }

        this.setState({
            bankAccountErrors: errors
        })
        return valid;
    }

    // Event Handlers

    removeBankAccountClickHandler = async () => {
        let registryVisibilityChanged = false

        if (this.state.registry && this.state.registry.isPublic) {
            let reqData = {
                query: UPDATE_REGISTRY_DETAIL,
                variables: {
                    registryId: this.state.registry.id,
                    registryData: {
                        isPublic: false
                    }
                }
            }

            await apiGraphql(reqData).then(res => res.json())
                .then(res => {
                    if (res.data && res.data.updateRegistry) {
                        registryVisibilityChanged = true
                    }
                    if (res.errors) {
                        console.log({ ...res.errors })
                        registryVisibilityChanged = false
                    }
                })
        }

        if (this.state.registry && this.state.registry.isPublic && !registryVisibilityChanged) {
            toast("Error occurred while making registry secret.", "error")
        } else {
            let reqData = {
                query: REMOVE_BANK_ACCOUNT,
                variables: {
                    bankAccountId: this.state.bankAccount[0].id
                }
            }

            await apiGraphql(reqData).then(res => res.json())
                .then(res => {
                    if (res.data && res.data.removeBankAccount) {
                        this.setState({
                            bankAccount: []
                        })
                        toast("Bank Account removed successfully.")
                    }
                    if (res.errors) {
                        if (res.errors) {
                            for (let error of res.errors) {
                                toast(error.message, "error")
                            }
                            console.error({ ...res.errors })
                        }
                    }
                })
        }

        this.setState({
            showConfirmRemoveModal: false
        })
    }

    removeAccountLinkClickHandler = ev => {
        ev.preventDefault()
        this.setState({
            showConfirmRemoveModal: true
        })
    }

    editAccountLinkClickHandler = ev => {
        ev.preventDefault();
        let state2Update = {}

        if (this.state.bankAccount.length > 0) {
            state2Update = {
                routingNumber: this.state.bankAccount[0].routingNumber,
                accountNumber: this.state.bankAccount[0].accountNumber,
                confirmAccountNumber: "",
                accountType: this.getAccountType(this.state.bankAccount[0].bankAccountType),
                firstName: this.state.bankAccount[0].firstName,
                lastName: this.state.bankAccount[0].lastName,
                addressLine1: this.state.bankAccount[0].addressLine1,
                addressLine2: this.state.bankAccount[0].addressLine2,
                city: this.state.bankAccount[0].city,
                country: this.getCountry(this.state.bankAccount[0].country),
                stateProvince: {
                    name: this.state.bankAccount[0].province
                },
                postalCode: this.state.bankAccount[0].zip,
                phone: this.state.bankAccount[0].phone,
                dateOfBirth: this.state.bankAccount[0].dateOfBirth,
            }
        }

        this.setState({
            ...state2Update,
            editBankAccount: true
        })
    }

    accountTypeChangeHandler = async (value, parentContainerId) => {
        let errors = { ...this.state.bankAccountErrors }
        if (errors.accountType) {
            delete errors.accountType
        }

        await this.setState({
            accountType: value,
            bankAccountErrors: errors
        })
        this.checkForSaveBtnState()

        let parentContainer = document.getElementById(parentContainerId)
        if (parentContainer) {
            parentContainer.classList.toggle('hide-custom-select-input');
        }
    }

    routingNumberChangeHandler = async (ev) => {
        if (ev.target.value.match(this.DIGIT)) {
            let errors = { ...this.state.bankAccountErrors }
            if (errors.routingNumber) {
                delete errors.routingNumber
            }

            await this.setState({
                routingNumber: ev.target.value,
                bankAccountErrors: errors
            })
            this.checkForSaveBtnState()
        }
    }

    accountNumberChangeHandler = async (ev) => {
        if (ev.target.value.match(this.DIGIT)) {
            let errors = { ...this.state.bankAccountErrors }
            if (errors.accountNumber) {
                delete errors.accountNumber
            }

            await this.setState({
                accountNumber: ev.target.value,
                bankAccountErrors: errors
            })
            this.checkForSaveBtnState()
        }
    }

    confirmAccountNumberChangeHandler = async (ev) => {
        if (ev.target.value.match(this.DIGIT)) {
            let errors = { ...this.state.bankAccountErrors }
            if (errors.confirmAccountNumber) {
                delete errors.confirmAccountNumber
            }

            await this.setState({
                confirmAccountNumber: ev.target.value,
                bankAccountErrors: errors
            })
            this.checkForSaveBtnState()
        }
    }

    firstNameChangeHandler = async (ev) => {
        if (ev.target.value.match(this.ALPHABET) || ev.target.value.length <= 0) {
            let errors = { ...this.state.bankAccountErrors }
            if (errors.firstName) {
                delete errors.firstName
            }

            await this.setState({
                firstName: ev.target.value,
                bankAccountErrors: errors
            })
            this.checkForSaveBtnState()
        }
    }

    lastNameChangeHandler = async (ev) => {
        if (ev.target.value.match(this.ALPHABET) || ev.target.value.length <= 0) {
            let errors = { ...this.state.bankAccountErrors }
            if (errors.lastName) {
                delete errors.lastName
            }

            await this.setState({
                lastName: ev.target.value,
                bankAccountErrors: errors
            })
            this.checkForSaveBtnState()
        }
    }

    addressLine1ChangeHandler = async (ev) => {
        let errors = { ...this.state.bankAccountErrors }
        if (errors.addressLine1) {
            delete errors.addressLine1
        }

        await this.setState({
            addressLine1: ev.target.value,
            bankAccountErrors: errors
        })
        this.checkForSaveBtnState()
    }

    addressLine2ChangeHandler = (ev) => {
        this.setState({
            addressLine2: ev.target.value
        })
    }

    cityChangeHandler = async (ev) => {
        if (ev.target.value.match(this.ALPHABET) || ev.target.value.length <= 0) {
            let errors = { ...this.state.bankAccountErrors }
            if (errors.city) {
                delete errors.city
            }
            await this.setState({
                city: ev.target.value,
                bankAccountErrors: errors
            })
            this.checkForSaveBtnState()
        }
    }

    selectTriggerClickHandler = (parentContainerId) => {
        let parentContainer = document.getElementById(parentContainerId)
        if (parentContainer) {
            if (parentContainer.classList.contains('hide-custom-select-input')) {
                parentContainer.classList.remove('hide-custom-select-input');
            }
        }
    }

    stateProvinceChangeHandler = async (value, parentContainerId) => {
        let errors = { ...this.state.bankAccountErrors }
        if (errors.stateProvince) {
            delete errors.stateProvince
        }

        await this.setState({
            stateProvince: value,
            bankAccountErrors: errors
        })
        this.checkForSaveBtnState()

        let parentContainer = document.getElementById(parentContainerId)
        if (parentContainer) {
            parentContainer.classList.toggle('hide-custom-select-input');
        }
    }

    postalCodeChangeHandler = async (ev) => {
        if (ev.target.value.match(this.DIGIT) && ev.target.value.length <= this.PIN_CODE_LENGTH) {
            let errors = { ...this.state.bankAccountErrors }
            if (errors.postalCode) {
                delete errors.postalCode
            }

            await this.setState({
                postalCode: ev.target.value,
                bankAccountErrors: errors
            })
            this.checkForSaveBtnState()
        }
    }

    phoneChangeHandler = async (ev) => {
        if (ev.target.value.match(this.PHONE_WITH_COUNTRY_CODE) || ev.target.value.match(this.PHONE_WITHOUT_COUNTRY_CODE) || ev.target.value.length <= 0) {
            let errors = { ...this.state.bankAccountErrors }
            if (errors.phone) {
                delete errors.phone
            }

            await this.setState({
                phone: ev.target.value,
                bankAccountErrors: errors
            })
            this.checkForSaveBtnState()
        }
    }

    dateOfBirthChangeHandler = async (ev) => {
        let errors = { ...this.state.bankAccountErrors }
        if (errors.dateOfBirth) {
            delete errors.dateOfBirth
        }
        await this.setState({
            dateOfBirth: ev.target.value,
            bankAccountErrors: errors
        })
        this.checkForSaveBtnState()
    }

    termsAcceptedChangeHandler = async () => {
        let errors = { ...this.state.bankAccountErrors }
        if (errors.termsAccepted) {
            delete errors.termsAccepted
        }
        await this.setState((prevState, _) => ({
            termsAccepted: !prevState.termsAccepted,
            bankAccountErrors: errors
        }))
        this.checkForSaveBtnState()
    }

    cancelClickHandler = (ev) => {
        ev.preventDefault()
        let clearData = this.getClearState()
        this.setState({
            ...clearData,
            editBankAccount: false,
        })
    }

    saveBankAccountClickHandler = () => {
        if (!this.validData()) {
            return
        }

        let reqData = {
            variables: {
                bankAccountInput: {
                    routingNumber: this.state.routingNumber,
                    accountNumber: this.state.accountNumber,
                    firstName: this.state.firstName,
                    confirmAccountNumber: this.state.confirmAccountNumber,
                    lastName: this.state.lastName,
                    addressLine1: this.state.addressLine1,
                    addressLine2: this.state.addressLine2,
                    bankAccountType: this.state.accountType.backendValue,
                    city: this.state.city,
                    province: this.state.stateProvince.name,
                    country: this.state.country.countryName,
                    zip: this.state.postalCode,
                    phone: this.state.phone,
                    dateOfBirth: this.state.dateOfBirth,
                    tncAccepted: this.state.termsAccepted
                }
            }
        };
        let mutationCalled = ''
        if (this.state.bankAccount.length <= 0) {
            mutationCalled = 'addBankAccount';
            reqData['query'] = window.ADD_BANK_ACCOUNT;
        } else {
            mutationCalled = 'updateBankAccount';
            reqData['query'] = window.UPDATE_BANK_ACCOUNT;
            reqData.variables['bankAccountId'] = this.state.bankAccount[0].id
        }

        apiGraphql(reqData).then(res => res.json())
            .then(res => {
                if (res.data && res.data[mutationCalled]) {
                    let clearData = this.getClearState()
                    this.setState({
                        ...clearData,
                        bankAccount: [res.data[mutationCalled].bankAccount],
                        editBankAccount: false
                    })
                    toast("Bank Account detail changed successfully.")
                }

                if (res.errors) {
                    for (let error of res.errors) {
                        if (error.errors && error.errors.errors.length > 0) {
                            for (let err of error.errors.errors) {
                                toast(err.message, "error")
                            }
                        } else {
                            toast(error.message, "error")
                        }

                    }
                    console.error({ ...res.errors })
                }
            })
    }

    getMaskedNumber = (value) => {
        let newString = ""
        let visibleNumber = 2
        for (let [i, s] of [...value].entries()) {
            if (i + 1 <= value.length - visibleNumber) {
                newString += "*"
            } else {
                newString += s
            }
        }
        return newString
    }

    render() {
        let bankAccountDetail = []
        let states = []

        if (this.state.editBankAccount && this.state.country.countryShortCode) {
            let country = this.countryRegionList.find(el => el.countryShortCode === this.state.country.countryShortCode)
            if (country && country.regions) {
                states = [...country.regions]
            } else {
                console.error("Unable to fetch country or region")
            }
        }

        if (this.state.bankAccount && this.state.bankAccount.length > 0) {
            let accountType = this.getAccountType(this.state.bankAccount[0].bankAccountType)
            // Data to display while listing
            bankAccountDetail = [
                {
                    label: (<span>Account Type</span>),
                    value: accountType.label ? accountType.label : ""
                }
                ,
                {
                    label: (<span>Routing Number<br></br>{`(${this.ROUTING_NUMBER_LENGTH} digits)`}</span>),
                    value: this.getMaskedNumber(this.state.bankAccount[0].routingNumber)
                },
                {
                    label: (<span>Account Number<br></br>{`(${this.MIN_ACCOUNT_NUMBER_LENGTH}-${this.MAX_ACCOUNT_NUMBER_LENGTH} digits)`}</span>),
                    value: this.getMaskedNumber(this.state.bankAccount[0].accountNumber)
                },
                {
                    label: (<span>Name</span>),
                    value: `${this.state.bankAccount[0].firstName ? this.state.bankAccount[0].firstName : ''} ${this.state.bankAccount[0].lastName ? this.state.bankAccount[0].lastName : ''}`
                },
                {
                    label: (<span>Address Line 1</span>),
                    value: this.state.bankAccount[0].addressLine1
                },
                {
                    label: (<span>Address Line 2</span>),
                    value: this.state.bankAccount[0].addressLine2
                },
                {
                    label: (<span>City</span>),
                    value: this.state.bankAccount[0].city
                },
                {
                    label: (<span>Country</span>),
                    value: this.state.bankAccount[0].country
                },
                {
                    label: (<span>State / Province</span>),
                    value: this.state.bankAccount[0].province
                },
                {
                    label: (<span>Postal / Zip Code</span>),
                    value: this.state.bankAccount[0].zip
                },
                {
                    label: (<span>Phone</span>),
                    value: this.state.bankAccount[0].phone
                },
                {
                    label: (<span>Date of Birth</span>),
                    value: this.state.bankAccount[0].dateOfBirth
                }
            ]
        }

        if (!this.state.registry && this.state.registrySearched) {
            return (
                <h1>No Registry</h1>
            )
        } else {
            if (this.state.bankAccount) {
                return (
                    <div className="settings-bank-account">
                        <div className="settings-component-headers">
                            <h3 className="d-inline-block mr-2">Bank Account</h3>
                            {this.state.bankAccount.length > 0 && !this.state.editBankAccount ?
                                <div className="d-inline-block">
                                    <a href="#" onClick={(ev) => this.editAccountLinkClickHandler(ev)} className="settings-link text-sm font-medium mr-2">Edit</a>
                                    <a href="#" onClick={(ev) => this.removeAccountLinkClickHandler(ev)} className="settings-link text-sm font-medium">Remove</a>
                                </div> : null}
                        </div>

                        {this.state.editBankAccount ?
                            // Edit Bank Account
                            <div className="edit-bank-account-section">

                                <div className="row">

                                    <div className="col-6">
                                        <div className="settings-input-container">
                                            <label className="settings-input-label settings-input-required text-sm font-medium m-0">Bank Account Type</label>
                                            <div className="custom-select-input">
                                                <button className={["custom-select-trigger w-100 text-left text-body", this.state.bankAccountErrors.accountType ? 'settings-input-error' : ''].join(' ')} onClick={() => this.selectTriggerClickHandler("bankAccountTypeSelectContainer")}>{this.state.accountType.label ? this.state.accountType.label : "Select account type"}</button>
                                                <div className="custom-select-container" id="bankAccountTypeSelectContainer">
                                                    <ul className="custom-select-lists w-100 p-0">
                                                        {this.bankAccountType.map(accountType => (
                                                            <li onClick={() => this.accountTypeChangeHandler(accountType, "bankAccountTypeSelectContainer")}>{accountType.label}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                            {this.state.bankAccountErrors.accountType ?
                                                <label className="settings-input-error-message text-sm m-0">{this.state.bankAccountErrors.accountType}</label>
                                                : null}
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="settings-input-container ">
                                            <label className="settings-input-label settings-input-required text-sm font-medium m-0">Routing Number {`(${this.ROUTING_NUMBER_LENGTH} digits)`}</label>
                                            <input
                                                className={["settings-input text-body mw-100 w-100 mb-0", this.state.bankAccountErrors.routingNumber ? 'settings-input-error' : ''].join(" ")}
                                                value={this.state.routingNumber}
                                                onChange={(ev) => this.routingNumberChangeHandler(ev)}
                                                type="text"
                                                name="routing-number"
                                                min={0}
                                            />
                                            {this.state.bankAccountErrors.routingNumber ?
                                                <label className="settings-input-error-message text-sm m-0">{this.state.bankAccountErrors.routingNumber}</label>
                                                : null}
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-6">
                                        <div className="settings-input-container input-container-margin">
                                            <label className="settings-input-label settings-input-required text-sm font-medium m-0">Account Number {`(${this.MIN_ACCOUNT_NUMBER_LENGTH}-${this.MAX_ACCOUNT_NUMBER_LENGTH} digits)`}</label>
                                            <input
                                                className={["settings-input text-body mw-100 w-100 mb-0", this.state.bankAccountErrors.accountNumber ? 'settings-input-error' : ''].join(" ")}
                                                value={this.state.accountNumber}
                                                onChange={(ev) => this.accountNumberChangeHandler(ev)}
                                                type="password"
                                                name="account-number"
                                                min={0}
                                            />
                                            {this.state.bankAccountErrors.accountNumber ?
                                                <label className="settings-input-error-message text-sm m-0">{this.state.bankAccountErrors.accountNumber}</label>
                                                : null}
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="settings-input-container input-container-margin">
                                            <label className="settings-input-label settings-input-required text-sm font-medium m-0">Confirm Account Number {`(${this.MIN_ACCOUNT_NUMBER_LENGTH}-${this.MAX_ACCOUNT_NUMBER_LENGTH} digits)`}</label>
                                            <input
                                                className={["settings-input text-body mw-100 w-100 mb-0", this.state.bankAccountErrors.confirmAccountNumber ? 'settings-input-error' : ''].join(" ")}
                                                value={this.state.confirmAccountNumber}
                                                onChange={(ev) => this.confirmAccountNumberChangeHandler(ev)}
                                                type="text"
                                                name="routing-number"
                                                min={0}
                                            />
                                            {this.state.bankAccountErrors.confirmAccountNumber ?
                                                <label className="settings-input-error-message text-sm m-0">{this.state.bankAccountErrors.confirmAccountNumber}</label>
                                                : null}
                                        </div>
                                    </div>

                                </div>

                                <div className="row">
                                    <div className="col-6">
                                        <div className="settings-input-container input-container-margin">
                                            <label className="settings-input-label settings-input-required text-sm font-medium m-0">First Name</label>
                                            <input
                                                className={["settings-input text-body mw-100 w-100 mb-0", this.state.bankAccountErrors.firstName ? 'settings-input-error' : ''].join(" ")}
                                                value={this.state.firstName}
                                                onChange={(ev) => this.firstNameChangeHandler(ev)}
                                                type="text"
                                                name="first-name"
                                                min={0}
                                            />
                                            {this.state.bankAccountErrors.firstName ?
                                                <label className="settings-input-error-message text-sm m-0">{this.state.bankAccountErrors.firstName}</label>
                                                : null}
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="settings-input-container input-container-margin">
                                            <label className="settings-input-label settings-input-required text-sm font-medium m-0">Last Name</label>
                                            <input
                                                className={["settings-input text-body mw-100 w-100 mb-0", this.state.bankAccountErrors.lastName ? 'settings-input-error' : ''].join(" ")}
                                                value={this.state.lastName}
                                                onChange={(ev) => this.lastNameChangeHandler(ev)}
                                                type="text"
                                                name="last-name"
                                                min={0}
                                            />
                                            {this.state.bankAccountErrors.lastName ?
                                                <label className="settings-input-error-message text-sm m-0">{this.state.bankAccountErrors.lastName}</label>
                                                : null}
                                        </div>
                                    </div>
                                </div>


                                <div className="row">
                                    <div className="col-6">
                                        <div className="settings-input-container input-container-margin">
                                            <label className="settings-input-label settings-input-required text-sm font-medium m-0">Address Line 1</label>
                                            <input
                                                className={["settings-input text-body mw-100 w-100 mb-0", this.state.bankAccountErrors.addressLine1 ? 'settings-input-error' : ''].join(" ")}
                                                value={this.state.addressLine1}
                                                onChange={(ev) => this.addressLine1ChangeHandler(ev)}
                                                type="text"
                                                name="address-line-1"
                                                min={0}
                                            />
                                            {this.state.bankAccountErrors.addressLine1 ?
                                                <label className="settings-input-error-message text-sm m-0">{this.state.bankAccountErrors.addressLine1}</label>
                                                : null}
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="settings-input-container input-container-margin">
                                            <label className="settings-input-label text-sm font-medium m-0">Address Line 2</label>
                                            <input
                                                className={["settings-input text-body mw-100 w-100 mb-0", this.state.bankAccountErrors.addressLine2 ? 'settings-input-error' : ''].join(" ")}
                                                value={this.state.addressLine2}
                                                onChange={(ev) => this.addressLine2ChangeHandler(ev)}
                                                type="text"
                                                name="address-line-2"
                                                min={0}
                                            />
                                            {this.state.bankAccountErrors.addressLine2 ?
                                                <label className="settings-input-error-message text-sm m-0">{this.state.bankAccountErrors.addressLine2}</label>
                                                : null}
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-6">
                                        <div className="settings-input-container input-container-margin">
                                            <label className="settings-input-label settings-input-required text-sm font-medium m-0">City</label>
                                            <input
                                                className={["settings-input text-body mw-100 w-100 mb-0", this.state.bankAccountErrors.city ? 'settings-input-error' : ''].join(" ")}
                                                value={this.state.city}
                                                onChange={(ev) => this.cityChangeHandler(ev)}
                                                type="text"
                                                name="city"
                                                min={0}
                                            />
                                            {this.state.bankAccountErrors.city ?
                                                <label className="settings-input-error-message text-sm m-0">{this.state.bankAccountErrors.city}</label>
                                                : null}
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="settings-input-container input-container-margin">
                                            <label className="settings-input-label settings-input-required text-sm font-medium m-0">Country</label>
                                            <input
                                                className={["settings-input text-body mw-100 w-100 mb-0", this.state.bankAccountErrors.country ? 'settings-input-error' : ''].join(" ")}
                                                value={this.state.country.countryName}
                                                type="text"
                                                disabled={true}
                                            />
                                            {this.state.bankAccountErrors.country ?
                                                <label className="settings-input-error-message text-sm m-0">{this.state.bankAccountErrors.country}</label>
                                                : null}
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-6">
                                        <div className="settings-input-container input-container-margin">
                                            <label className="settings-input-label settings-input-required text-sm font-medium m-0">State / Province</label>
                                            {/* TODO: Change this to State/Province Dropdown */}
                                            {/* <input
                                                className={["settings-input text-body mw-100 w-100 mb-0", this.state.bankAccountErrors.stateProvince ? 'settings-input-error' : ''].join(" ")}
                                                value={this.state.stateProvince}
                                                onChange={(ev) => this.stateProvinceChangeHandler(ev)}
                                                type="text"
                                                name="state-province"
                                                min={0}
                                            /> */}
                                            <div className="custom-select-input">
                                                <button className={["custom-select-trigger w-100 text-left text-body", this.state.bankAccountErrors.stateProvince ? 'settings-input-error' : ''].join(' ')} onClick={() => this.selectTriggerClickHandler("stateSelectContainer")}>{this.state.stateProvince.name ? this.state.stateProvince.name : "Select State/Province"}</button>
                                                <div className="custom-select-container" id="stateSelectContainer">
                                                    <ul className="custom-select-lists w-100 p-0">
                                                        {states.map(state => (
                                                            <li onClick={() => this.stateProvinceChangeHandler(state, "stateSelectContainer")}>{state.name}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                            {this.state.bankAccountErrors.stateProvince ?
                                                <label className="settings-input-error-message text-sm m-0">{this.state.bankAccountErrors.stateProvince}</label>
                                                : null}
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="settings-input-container input-container-margin">
                                            <label className="settings-input-label settings-input-required text-sm font-medium m-0">Postal / Zip Code</label>
                                            <input
                                                className={["settings-input text-body mw-100 w-100 mb-0", this.state.bankAccountErrors.postalCode ? 'settings-input-error' : ''].join(" ")}
                                                value={this.state.postalCode}
                                                onChange={(ev) => this.postalCodeChangeHandler(ev)}
                                                type="text"
                                                name="postal-code"
                                                min={0}
                                            />
                                            {this.state.bankAccountErrors.postalCode ?
                                                <label className="settings-input-error-message text-sm m-0">{this.state.bankAccountErrors.postalCode}</label>
                                                : null}
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-6">
                                        <div className="settings-input-container input-container-margin">
                                            <label className="settings-input-label settings-input-required text-sm font-medium m-0">Phone</label>
                                            <input
                                                className={["settings-input text-body mw-100 w-100 mb-0", this.state.bankAccountErrors.phone ? 'settings-input-error' : ''].join(" ")}
                                                value={this.state.phone}
                                                onChange={(ev) => this.phoneChangeHandler(ev)}
                                                type="text"
                                                name="phone"
                                            />
                                            {this.state.bankAccountErrors.phone ?
                                                <label className="settings-input-error-message text-sm m-0">{this.state.bankAccountErrors.phone}</label>
                                                : null}
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="settings-input-container input-container-margin">
                                            <label className="settings-input-label settings-input-required text-sm font-medium m-0">Date of Birth</label>
                                            <input
                                                className={["settings-input text-body mw-100 w-100 mb-0", this.state.bankAccountErrors.dateOfBirth ? 'settings-input-error' : ''].join(" ")}
                                                value={this.state.dateOfBirth}
                                                onChange={(ev) => this.dateOfBirthChangeHandler(ev)}
                                                type="date"
                                                name="date-of-birth"
                                                min={0}
                                            />
                                            {this.state.bankAccountErrors.dateOfBirth ?
                                                <label className="settings-input-error-message text-sm m-0">{this.state.bankAccountErrors.dateOfBirth}</label>
                                                : null}
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-12">
                                        <div className="settings-input-container input-container-margin">
                                            <label className="settings-input-label text-sm font-medium m-0">Terms of Service</label>
                                            <textarea
                                                className="settings-textarea bank-account-terms text-sm mw-100 w-100"
                                                value={this.state.termsCondition}
                                                disabled={true}
                                                rows={7} />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-12">
                                        <div className="settings-input-container input-container-margin">
                                            <CheckBox
                                                display="I agree to the Terms of Service"
                                                textClass="bank-account-terms-check-box"
                                                checked={this.state.termsAccepted}
                                                changeHandler={this.termsAcceptedChangeHandler}
                                            />
                                            {this.state.bankAccountErrors.termsAccepted ?
                                                <label className="settings-input-error-message text-sm m-0">{this.state.bankAccountErrors.termsAccepted}</label>
                                                : null}
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col settings-edit-footer-section mb-4">
                                        <Button
                                            className="settings-edit-footer-button text-body font-medium"
                                            onClick={this.saveBankAccountClickHandler}
                                            disabled={!this.state.enableSaveButton}
                                        >Save</Button>
                                        <a href="#" className="settings-link text-body font-medium settings-edit-footer-cancel" onClick={(ev) => this.cancelClickHandler(ev)}>Cancel</a>
                                    </div>
                                </div>

                            </div>
                            :
                            // Listing Bank Account
                            this.state.bankAccount.length <= 0 ?
                                <div className="no-bank-account">
                                    <a className="settings-link text-body" href="#" onClick={(ev) => this.editAccountLinkClickHandler(ev)}><u>Add Bank Details</u></a>
                                    <p className="text-body">The bank account entered must be a valid U.S. checking account.</p>
                                </div>
                                :
                                <div>
                                    {bankAccountDetail.map(detail => (
                                        <div className="row mt-2">
                                            <div className="col-3">
                                                <p className="text-sm font-medium">{detail.label}</p>
                                            </div>
                                            <div className="col">
                                                <p className="text-sm">{detail.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                        }

                        <ModalComponent
                            show={this.state.showConfirmRemoveModal}
                            size="md"
                            closeModal={() => this.setState({ showConfirmRemoveModal: false })}
                            footer={
                                <div>
                                    <Button
                                        variant="secondary"
                                        onClick={() => this.setState({ showConfirmRemoveModal: false })}
                                        className="bank-detail-remove-button text-body font-medium mr-2"
                                    >Do Not Remove</Button>

                                    <Button
                                        variant="primary"
                                        onClick={this.removeBankAccountClickHandler}
                                        className="bank-detail-remove-button text-body font-medium"
                                    >Yes, Please Remove</Button>
                                </div>
                            }
                        >

                            {this.state.registry ?
                                this.state.registry.isPublic ?
                                    <div>
                                        <h2>Removing your bank details will set your registry to private.</h2>
                                        <p className="text-sm bank-detail-remove-modal-subtext mt-1">Your guests won’t be able to see your registry. Are you sure you want to remove your bank details?</p>
                                    </div>
                                    :
                                    <h2>Are you sure you want remove Bank Account?</h2>
                                : null}

                        </ModalComponent>
                    </div>
                )
            } else {
                return null
            }
        }
    }
}

class MyDetail extends React.Component {
    EMAIL_RE = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
    ALPHABET = /^[A-Za-z]+$/g

    state = {
        userInfo: {},
        editAccountDetail: false,
        accountFirstName: "",
        accountLastName: "",
        accountEmail: "",
        accountErrors: {},
        accountInputChanged: false,
        resetEmailSent: false
    }

    componentDidMount() {
        let userData = window.updateCurrentUserDetail()
        userData.then(data => {
            this.setState({
                userInfo: data
            })
        })
    }

    validData = () => {
        var errors = {}
        let returnStatus = true;

        if (this.state.accountFirstName.length <= 0) {
            errors['firstName'] = "This field is mandatory"
            returnStatus = false;
        }

        if (this.state.accountLastName.length <= 0) {
            errors['lastName'] = "This field is mandatory"
            returnStatus = false;
        }

        // Not updating email
        // if (this.state.accountEmail.length <= 0) {
        //     errors['email'] = "This field is mandatory"
        //     returnStatus = false;
        // } else {
        //     if (!this.state.accountEmail.match(this.EMAIL_RE)) {
        //         errors['email'] = "Invalid Email address"
        //         returnStatus = false;
        //     }
        // }

        this.setState({
            accountErrors: errors
        })

        return returnStatus
    }

    // Event Handlers
    editAccountDetailClickHandler = (ev) => {
        ev.preventDefault()
        this.setState({
            editAccountDetail: true,
            accountFirstName: this.state.userInfo.firstName ? this.state.userInfo.firstName : "",
            accountLastName: this.state.userInfo.lastName ? this.state.userInfo.lastName : "",
            accountEmail: this.state.userInfo.email ? this.state.userInfo.email : ""
        })
    }

    firstNameChangeHandler = (ev) => {
        if (ev.target.value.match(this.ALPHABET) || ev.target.value.length <= 0) {
            let error = { ...this.state.accountErrors }
            if (error.firstName) {
                delete error.firstName
            }
            this.setState({
                accountFirstName: ev.target.value,
                accountErrors: error,
                accountInputChanged: true
            })
        }
    }

    lastNameChangeHandler = (ev) => {
        if (ev.target.value.match(this.ALPHABET) || ev.target.value.length <= 0) {
            let error = { ...this.state.accountErrors }
            if (error.lastName) {
                delete error.lastName
            }
            this.setState({
                accountLastName: ev.target.value,
                accountErrors: error,
                accountInputChanged: true
            })
        }
    }

    // Not updating email
    // emailChangeHandler = (ev) => {
    //     let error = { ...this.state.accountErrors }
    //     if (error.email) {
    //         delete error.email
    //     }
    //     this.setState({
    //         accountEmail: ev.target.value,
    //         accountErrors: error,
    //         accountInputChanged: true
    //     })
    // }

    saveAccountDetailClickHandler = () => {
        if (!this.validData()) {
            return false
        }

        let reqData = {
            query: window.UPDATE_USER,
            variables: {
                firstName: this.state.accountFirstName,
                lastName: this.state.accountLastName
            }
        }

        apiGraphql(reqData).then(res => res.json())
            .then(res => {
                if (res.data && res.data.updateAccount) {
                    this.setState({
                        userInfo: res.data.updateAccount.user
                    })
                    this.clearEditState();
                    toast("Details updated successfully.", "success")
                }
                if (res.errors) {
                    toast("Error occurred while updating details.", "error")
                    console.error({ ...res.errors })
                }
            })

    }

    resetPasswordClickHandler = (ev) => {
        ev.preventDefault()
        if (this.state.userInfo.email) {
            let reqData = {
                query: window.RESET_PASSWORD,
                variables: {
                    email: this.state.userInfo.email
                }
            }
            apiGraphql(reqData).then(res => res.json())
                .then(res => {
                    if (res.data && res.data.resetPassword && res.data.resetPassword.message) {
                        this.setState({
                            resetEmailSent: true
                        })
                    }
                    if (res.errors) {
                        toast("Error occurred while resetting password.", "error")
                        console.error({ ...res.errors })
                    }
                })
        }
    }

    clearEditState = () => {
        this.setState({
            editAccountDetail: false,
            accountErrors: {},
            accountInputChanged: false
        })
    }

    cancelClickHandler = (ev) => {
        ev.preventDefault();
        this.clearEditState();
    }

    render() {
        return (
            <div className="settings-my-detail">
                <div className="my-detail-account-detail">
                    <div className="settings-component-headers">
                        <h3 className="d-inline-block mr-1">Account Details</h3>
                        {!this.state.editAccountDetail ? <a href="#" onClick={(ev) => this.editAccountDetailClickHandler(ev)} className="settings-link text-sm font-medium">Edit</a> : null}
                    </div>

                    {this.state.editAccountDetail ?
                        <div className="my-detail-account-edit">

                            <div className="row">
                                <div className="col-6">
                                    <div className="settings-input-container">
                                        <label className="settings-input-label settings-input-required text-sm font-medium m-0">First Name</label>
                                        <input
                                            className={["settings-input text-body mw-100 w-100 mb-0", this.state.accountErrors.firstName ? 'settings-input-error' : ''].join(" ")}
                                            value={this.state.accountFirstName}
                                            onChange={(ev) => this.firstNameChangeHandler(ev)}
                                            type="text"
                                            name="first-name" />
                                        {this.state.accountErrors.firstName ?
                                            <label className="settings-input-error-message text-sm m-0">{this.state.accountErrors.firstName}</label>
                                            : null}
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="settings-input-container">
                                        <label className="settings-input-label settings-input-required text-sm font-medium m-0">Last Name</label>
                                        <input
                                            className={["settings-input text-body mw-100 w-100 mb-0", this.state.accountErrors.lastName ? 'settings-input-error' : ''].join(" ")}
                                            value={this.state.accountLastName}
                                            onChange={(ev) => this.lastNameChangeHandler(ev)}
                                            type="text"
                                            name="last-name" />
                                        {this.state.accountErrors.lastName ?
                                            <label className="settings-input-error-message text-sm m-0">{this.state.accountErrors.lastName}</label>
                                            : null}
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-6">
                                    <div className="settings-input-container input-container-margin">
                                        <label className="settings-input-label settings-input-required text-sm font-medium m-0">Email</label>
                                        <input
                                            className={["settings-input text-body mw-100 w-100 mb-0", this.state.accountErrors.email ? 'settings-input-error' : ''].join(" ")}
                                            value={this.state.accountEmail}
                                            // onChange={(ev) => this.emailChangeHandler(ev)}
                                            disabled={true}
                                            type="text"
                                            name="email" />
                                        {this.state.accountErrors.email ?
                                            <label className="settings-input-error-message text-sm m-0">{this.state.accountErrors.email}</label>
                                            : null}
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col settings-edit-footer-section">
                                    <Button
                                        className="settings-edit-footer-button text-body font-medium"
                                        onClick={this.saveAccountDetailClickHandler}
                                        disabled={!this.state.accountInputChanged || Object.keys(this.state.accountErrors).length > 0}
                                    >Save</Button>
                                    <a href="#" className="settings-link text-body font-medium settings-edit-footer-cancel" onClick={(ev) => this.cancelClickHandler(ev)}>Cancel</a>
                                </div>
                            </div>
                        </div>
                        :
                        <div>
                            <div className="row">
                                <div className="col-2">
                                    <p className="text-sm font-medium">Name</p>
                                </div>
                                <div className="col">
                                    <p className="text-sm">{`${this.state.userInfo.firstName ? this.state.userInfo.firstName : ''} ${this.state.userInfo.lastName ? this.state.userInfo.lastName : ''}`}</p>
                                </div>
                            </div>

                            <div className="row mt-2">
                                <div className="col-2">
                                    <p className="text-sm font-medium">Email</p>
                                </div>
                                <div className="col">
                                    <p className="text-sm">{`${this.state.userInfo.email ? this.state.userInfo.email : ''}`}</p>
                                </div>
                            </div>
                        </div>
                    }
                </div>

                <div className="my-detail-password">
                    <div className="my-detail-header">
                        <h3 className="d-inline-block mr-1">Password</h3>
                        <a href="#" className="settings-link text-sm font-medium" onClick={(ev) => this.resetPasswordClickHandler(ev)}>Reset</a>
                    </div>
                    {this.state.resetEmailSent ?
                        <p className="my-detail-reset-email-sent text-body">We’ve sent you an email with a link to update your password</p>
                        : null}
                    {/* TODO: Password changed detail to be implemented */}
                </div>
            </div>
        )
    }
}
