import { Response, CookieOptions } from "express";
import { fifteenMinutesFromNow, thirtDaysFromNow } from "./date";

const secure = process.env.NODE_ENV !== "development"


const defaults: CookieOptions = {
    sameSite: "strict",
    httpOnly: true,
    secure
}


const getAccessTokenCookieOptions = (): CookieOptions => ({
    ...defaults,
    expires: fifteenMinutesFromNow()
})

const getRefreshTokenCookieOptions = (): CookieOptions => ({
    ...defaults,
    expires: thirtDaysFromNow(),
    path: "/auth/refresh"
})

type Params = {
    res: Response;
    accessToken: string
    refreshToken: string;
}

export const setAuthCookies = ({ res, accessToken, refreshToken}: Params) =>
    res
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());