interface Authuser {
    hash:string
    range:string,
    index:string,
    username:string,
    phoneNumber:string,
    // possword:string,
}

interface SendPhone {
    mobile:'18779868511',
    devices: 'phone' | 'web'
}