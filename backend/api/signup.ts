import {base32Decode} from "@ctrl/ts-base32"
import {Permission, signupToken, token} from "../../scheme/api/auth"
import createResponse from "../createResponse"
import {getVerificationMailHTML, sendMail} from "../util/mail"
import express from "express"
import jwt from "jsonwebtoken"
import {getServerToken} from "../util/serverState"
import getSecret from "../util/secret"
import createURL from "../../scheme/url"
import path from "path";

const signupTokenExpire = 1000 * 60 * 60

const router = express.Router()

router.post('/verify', (req, res, next) => {
    let errRes = false, uid: number
    if (req.body.code.length !== 24) errRes = true
    let orgCode
    try {
        orgCode = Buffer.from(base32Decode(req.body.code)).toString()
        if (orgCode.length !== 15 || orgCode[0] !== 'C') errRes = true
        orgCode = orgCode.replace(/C|O|D|E/g, '')
        if (orgCode.length !== 8 || (orgCode[0] !== 'S' && orgCode[0] !== 'T')) errRes = true
        if (orgCode.substr(1).replace(/\D+/g, '').length !== 7) errRes = true
        if (req.body.type !== Permission.student && req.body.type !== Permission.teacher) errRes = true
        if (req.body.type === Permission.student && orgCode[0] !== 'S') errRes = true
        if (req.body.type === Permission.teacher && orgCode[0] !== 'T') errRes = true
        uid = parseInt(orgCode.substr(1).replace(/\D+/g, ''))
    } catch (e) {
        errRes = true
    }

    if (errRes) {
        res.status(403)
        res.send(createResponse(false, "코드가 올바르지 않아요."))
        return
    } else {
        res.send(createResponse({
            type: req.body.type,
            uid: uid
        }))
        return
    }
})

router.post('/mail', async (req, res, next) => {
    let errRes = false, uid: number
    if (req.body.code.length !== 24) errRes = true
    let orgCode
    try {
        orgCode = Buffer.from(base32Decode(req.body.code)).toString()
        if (orgCode.length !== 15 || orgCode[0] !== 'C') errRes = true
        orgCode = orgCode.replace(/C|O|D|E/g, '')
        if (orgCode.length !== 8 || (orgCode[0] !== 'S' && orgCode[0] !== 'T')) errRes = true
        if (orgCode.substr(1).replace(/\D+/g, '').length !== 7) errRes = true
        if (req.body.type !== Permission.student && req.body.type !== Permission.teacher) errRes = true
        if (req.body.type === Permission.student && orgCode[0] !== 'S') errRes = true
        if (req.body.type === Permission.teacher && orgCode[0] !== 'T') errRes = true
        uid = parseInt(orgCode.substr(1).replace(/\D+/g, ''))
    } catch (e) {
        errRes = true
    }

    if (errRes) {
        res.status(403)
        res.send(createResponse(false, "코드가 올바르지 않아요."))
        return
    }

    let token = jwt.sign({
        type: req.body.type,
        uid: uid,
        id: req.body.id.toLowerCase(),
        password: req.body.password,
        email: req.body.email,
        name: req.body.name,
        expire: Date.now() + signupTokenExpire
    } as signupToken, getSecret('token'))


    let mailRes = await sendMail(getVerificationMailHTML(createURL('api', 'account', 'signup', 'finalize', token)), 'welcome', req.body.email)
    if (mailRes) res.send(createResponse(true))
    else {
        res.status(500)
        res.send(createResponse(false, '인증 메일을 보내지 못했어요.'))
    }
})

router.get('/finalize/:token', (req, res, next) => {
    try {
        let token = jwt.verify(req.params.token, getSecret('token')) as signupToken
        if (token.expire < Date.now()) {
            res.sendFile(path.join(__dirname, '..', '..', '..', 'template', 'signupfail.html'))
            return
        }
    } catch (e) {
        res.sendFile(path.join(__dirname, '..', '..', '..', 'template', 'signupfail.html'))
        return
    }
    res.sendFile(path.join(__dirname, '..', '..', '..', 'template', 'signupsucc.html'))
})

export default router
