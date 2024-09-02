export const fetchUser = () => {
    const userInfo = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')): localStorage.clear()  //this function is created with the purpose of fetching the user data from the local storage

    return userInfo
}