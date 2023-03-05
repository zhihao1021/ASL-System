// function postJSON(url, data, callback = null, error = null) {
//     if (typeof data === "object") {
//         data = JSON.stringify(data);
//     }
//     $.ajax({
//         url: url,
//         type: "POST",
//         contentType: "application/json; charset=utf-8",
//         dataType: "json",
//         data: data,
//         success: callback,
//         error: error
//     });
// };


// function getGreeting(user) {
//     if (user) {
//         return <h1>Hello, {user}!</h1>;
//     }
//     return <h1>Hello, Stranger.</h1>;
// }

// const element = getGreeting();