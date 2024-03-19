import {FormResponse} from "../components/KMTypes";

const baseUrl = "https://kam-backend.vercel.app/"

/**
 * Sends a `PUT` request to the backend to record a form response from a user.
 *
 *
 *
 * Validation must be done on the user data before this button is called.
 *
 * In case of any error, the error message will be logged into the console (which, in production) might not be
 * very useful. But the error should also be logged in the backend which might prove useful.
 *
 *
 * @supported Switching between `localhost` and actual backend URL.
 * @summary Sends request to backend to store a form response.
 * @returns `true` if server returns status `200`.
 * @since 0.0.0
 * @author Praanto
 * @param data `FormResponse`
 * @see FormResponse
 * @see `fetch`
 */
export default async function formRespond(data: FormResponse) {
    try {
        let fetchUrl = baseUrl + `form/respond?formId=${data.formId}`
        console.log(fetchUrl)
        let result = await fetch(fetchUrl, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                'aKey': import.meta.env["VITE_PUBLIC_SEC"]!,
                'Content-Type': "application/json"
            }
        })

        console.log(result.status)
        return result.status == 204
    } catch (e) {
        console.log(e)
        return false
    }

}