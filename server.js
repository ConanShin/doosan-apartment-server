const express = require('express')
const app = express()
const axios = require('axios')

const doosanOnly = items => {
    return items.filter(item => item["아파트"] === '두산')
}

let response = []

app.get('/', async (req, res) => {
    const ServiceKey = 'alJI2tyVWfvJgufBQ1Q2DGYe5QUPWcPJ11x6W9hTWil3uLnIsK2ABRLn6FFnIZt5EzJI2lage2Aaa7ub9vLoWA%3D%3D'
    const LAWD_CD = '11200'
    const TODAY = new Date()
    const LAST_MONTH = '' + TODAY.getFullYear() + ('0' + TODAY.getMonth()).slice(-2)
    const THIS_MONTH = '' + TODAY.getFullYear() + ('0' + (TODAY.getMonth() + 1)).slice(-2)
    const URL_LAST_MONTH = `http://openapi.molit.go.kr:8081/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTrade?LAWD_CD=${LAWD_CD}&DEAL_YMD=${LAST_MONTH}&ServiceKey=${ServiceKey}`
    const URL_THIS_MONTH = `http://openapi.molit.go.kr:8081/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTrade?LAWD_CD=${LAWD_CD}&DEAL_YMD=${THIS_MONTH}&ServiceKey=${ServiceKey}`
    try {
        if (response.length !== 0) return res.send(response)
        console.log('fetching data from open API server')
        const {data: {response: {body: {items: {item: thisMonthItem}}}}} = await axios.get(URL_LAST_MONTH)
        const {data: {response: {body: {items: {item: lastMonthItem}}}}} = await axios.get(URL_THIS_MONTH)
        response = doosanOnly(lastMonthItem.concat(thisMonthItem))
        return res.send(response)
    } catch (error) {
        console.log(error)
        res.send(error)
    }

})

const server = app.listen(5001, () => {
    console.log("Express server has started on port 5001")
})
