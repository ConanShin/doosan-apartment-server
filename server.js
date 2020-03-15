const express = require('express')
const app = express()
const cors = require('cors')
const axios = require('axios')

app.use(cors())
let response = []

const doosanOnly = items => {
    return items.filter(item => item["아파트"] === '두산').sort((a, b) => b["년"] - a["년"] || b["월"] - a["월"] || b["일"] - a["일"])
}

app.get('/', async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    console.log('somebody ask for data: ', ip)
    const ServiceKey = 'alJI2tyVWfvJgufBQ1Q2DGYe5QUPWcPJ11x6W9hTWil3uLnIsK2ABRLn6FFnIZt5EzJI2lage2Aaa7ub9vLoWA%3D%3D'
    const LAWD_CD = '11200'
    let THIS_MONTH = new Date()
    let LAST_MONTH = new Date()
    LAST_MONTH.setMonth(LAST_MONTH.getMonth() - 1)
    LAST_MONTH = '' + LAST_MONTH.getFullYear() + ('0' + (LAST_MONTH.getMonth() + 1)).slice(-2)
    THIS_MONTH = '' + THIS_MONTH.getFullYear() + ('0' + (THIS_MONTH.getMonth() + 1)).slice(-2)
    THIS_MONTH = '202001'
    LAST_MONTH = '201912'
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
    console.log(new Date().toISOString() + " Express server has started on port 5001")
})
