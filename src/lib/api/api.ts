/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** AccessTokenCreate */
export interface AccessTokenCreate {
  /**
   * Package Id
   * @format uuid
   */
  package_id: string;
  /**
   * Max Uses
   * @default 1
   */
  max_uses?: number;
  /**
   * Duration Days
   * @default 7
   */
  duration_days?: number;
}

/** AccessTokenResponse */
export interface AccessTokenResponse {
  /**
   * Id
   * @format uuid
   */
  id: string;
  /** Code */
  code: string;
  package: PackageResponse;
  /** Max Uses */
  max_uses: number;
  /** Times Used */
  times_used: number;
  /**
   * Expires At
   * @format date-time
   */
  expires_at: string;
  /** Is Active */
  is_active: boolean;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
}

/** Body_login_auth_login_post */
export interface BodyLoginAuthLoginPost {
  /** Grant Type */
  grant_type?: string | null;
  /** Username */
  username: string;
  /**
   * Password
   * @format password
   */
  password: string;
  /**
   * Scope
   * @default ""
   */
  scope?: string;
  /** Client Id */
  client_id?: string | null;
  /**
   * Client Secret
   * @format password
   */
  client_secret?: string | null;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** LoginSessionResponse */
export interface LoginSessionResponse {
  /**
   * Id
   * @format uuid
   */
  id: string;
  /**
   * User Id
   * @format uuid
   */
  user_id: string;
  /** Ip Address */
  ip_address?: string | null;
  /** Device */
  device?: string | null;
  /** Browser */
  browser?: string | null;
  /** Os */
  os?: string | null;
  /** User Agent Raw */
  user_agent_raw?: string | null;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /** Is Active */
  is_active: boolean;
}

/** PackageCreate */
export interface PackageCreate {
  /** Name */
  name: string;
  /** Price */
  price: number;
  /**
   * Currency
   * @default "UGX"
   */
  currency?: string;
  /** Duration Days */
  duration_days: number;
  /** Description */
  description?: string | null;
}

/** PackageResponse */
export interface PackageResponse {
  /**
   * Id
   * @format uuid
   */
  id: string;
  /** Name */
  name: string;
  /** Price */
  price: number;
  /** Currency */
  currency: string;
  /** Duration Days */
  duration_days: number;
  /** Description */
  description?: string | null;
  /** Is Active */
  is_active: boolean;
}

/** RedeemTokenRequest */
export interface RedeemTokenRequest {
  /** Code */
  code: string;
  /** Phone Number */
  phone_number: string;
}

/** RedeemTokenResponse */
export interface RedeemTokenResponse {
  /** Message */
  message: string;
  subscription: SubscriptionResponse;
}

/** SubscribeRequest */
export interface SubscribeRequest {
  /** Phone Number */
  phone_number: string;
  /**
   * Package Id
   * @format uuid
   */
  package_id: string;
}

/** SubscriptionResponse */
export interface SubscriptionResponse {
  /**
   * Id
   * @format uuid
   */
  id: string;
  /**
   * User Id
   * @format uuid
   */
  user_id: string;
  package: PackageResponse;
  /** Phone Number */
  phone_number: string;
  /**
   * Start Date
   * @format date-time
   */
  start_date: string;
  /**
   * End Date
   * @format date-time
   */
  end_date: string;
  /** Is Active */
  is_active: boolean;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
}

/** SubscriptionStatusResponse */
export interface SubscriptionStatusResponse {
  /** Is Subscribed */
  is_subscribed: boolean;
  subscription?: SubscriptionResponse | null;
  /** Message */
  message: string;
}

/** TokenResponse */
export interface TokenResponse {
  /** Access Token */
  access_token: string;
  /** Token Type */
  token_type: string;
}

/** TransactionResponse */
export interface TransactionResponse {
  /**
   * Id
   * @format uuid
   */
  id: string;
  /**
   * User Id
   * @format uuid
   */
  user_id: string;
  /** Package Id */
  package_id?: string | null;
  /** Phone Number */
  phone_number?: string | null;
  /**
   * Amount
   * @default 0
   */
  amount?: number | null;
  /** Currency */
  currency: string;
  /** Transaction Type */
  transaction_type: string;
  /** Description */
  description: string;
  /** Details */
  details?: string | null;
  /** Status */
  status: string;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
}

/** UserCreate */
export interface UserCreate {
  /**
   * Email
   * @format email
   */
  email: string;
  /** Password */
  password: string;
}

/** UserResponse */
export interface UserResponse {
  /**
   * Email
   * @format email
   */
  email: string;
  /** Username */
  username: string;
  /**
   * Id
   * @format uuid
   */
  id: string;
  /** Subscribed */
  subscribed?: boolean | null;
}

/** UserUpdatePassword */
export interface UserUpdatePassword {
  /** Old Password */
  old_password: string;
  /** New Password */
  new_password: string;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
  /** Input */
  input?: any;
  /** Context */
  ctx?: object;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Pitbox API
 * @version 0.1.0
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @name RootGet
   * @summary Root
   * @request GET:/
   */
  rootGet = (params: RequestParams = {}) =>
    this.request<any, any>({
      path: `/`,
      method: "GET",
      format: "json",
      ...params,
    });

  auth = {
    /**
     * @description Register a new user.
     *
     * @tags Authentication
     * @name RegisterAuthRegisterPost
     * @summary Register
     * @request POST:/auth/register
     */
    registerAuthRegisterPost: (data: UserCreate, params: RequestParams = {}) =>
      this.request<UserResponse, HTTPValidationError>({
        path: `/auth/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Login and receive a JWT access token.
     *
     * @tags Authentication
     * @name LoginAuthLoginPost
     * @summary Login
     * @request POST:/auth/login
     */
    loginAuthLoginPost: (
      data: BodyLoginAuthLoginPost,
      params: RequestParams = {},
    ) =>
      this.request<TokenResponse, HTTPValidationError>({
        path: `/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.UrlEncoded,
        format: "json",
        ...params,
      }),

    /**
     * @description Get the currently authenticated user's profile.
     *
     * @tags Authentication
     * @name GetMeAuthMeGet
     * @summary Get Me
     * @request GET:/auth/me
     * @secure
     */
    getMeAuthMeGet: (params: RequestParams = {}) =>
      this.request<UserResponse, any>({
        path: `/auth/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Change the current user's password.
     *
     * @tags Authentication
     * @name ChangePasswordAuthChangePasswordPut
     * @summary Change Password
     * @request PUT:/auth/change-password
     * @secure
     */
    changePasswordAuthChangePasswordPut: (
      data: UserUpdatePassword,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/auth/change-password`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get the current user's login session history.
     *
     * @tags Authentication
     * @name GetLoginSessionsAuthSessionsGet
     * @summary Get Login Sessions
     * @request GET:/auth/sessions
     * @secure
     */
    getLoginSessionsAuthSessionsGet: (params: RequestParams = {}) =>
      this.request<LoginSessionResponse[], any>({
        path: `/auth/sessions`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * @description Get all users/staff. Requires authentication.
     *
     * @tags Users
     * @name GetAllUsersUsersGet
     * @summary Get All Users
     * @request GET:/users/
     * @secure
     */
    getAllUsersUsersGet: (params: RequestParams = {}) =>
      this.request<UserResponse[], any>({
        path: `/users/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get a specific user by ID. Requires authentication.
     *
     * @tags Users
     * @name GetUserUsersUserIdGet
     * @summary Get User
     * @request GET:/users/{user_id}
     * @secure
     */
    getUserUsersUserIdGet: (userId: number, params: RequestParams = {}) =>
      this.request<UserResponse, HTTPValidationError>({
        path: `/users/${userId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  subscriptions = {
    /**
     * @description List all available subscription packages. No auth required.
     *
     * @tags Subscriptions
     * @name ListPackagesSubscriptionsPackagesGet
     * @summary List Packages
     * @request GET:/subscriptions/packages
     */
    listPackagesSubscriptionsPackagesGet: (params: RequestParams = {}) =>
      this.request<PackageResponse[], any>({
        path: `/subscriptions/packages`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new subscription package (admin).
     *
     * @tags Subscriptions
     * @name CreatePackageSubscriptionsPackagesPost
     * @summary Create Package
     * @request POST:/subscriptions/packages
     * @secure
     */
    createPackageSubscriptionsPackagesPost: (
      data: PackageCreate,
      params: RequestParams = {},
    ) =>
      this.request<PackageResponse, HTTPValidationError>({
        path: `/subscriptions/packages`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Subscribe to a package. User provides their phone number and selects a package.
     *
     * @tags Subscriptions
     * @name SubscribeSubscriptionsSubscribePost
     * @summary Subscribe
     * @request POST:/subscriptions/subscribe
     * @secure
     */
    subscribeSubscriptionsSubscribePost: (
      data: SubscribeRequest,
      params: RequestParams = {},
    ) =>
      this.request<SubscriptionResponse, HTTPValidationError>({
        path: `/subscriptions/subscribe`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Check if the current user has an active subscription.
     *
     * @tags Subscriptions
     * @name SubscriptionStatusSubscriptionsStatusGet
     * @summary Subscription Status
     * @request GET:/subscriptions/status
     * @secure
     */
    subscriptionStatusSubscriptionsStatusGet: (params: RequestParams = {}) =>
      this.request<SubscriptionStatusResponse, any>({
        path: `/subscriptions/status`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get the current user's full transaction/activity history.
     *
     * @tags Subscriptions
     * @name GetTransactionsSubscriptionsTransactionsGet
     * @summary Get Transactions
     * @request GET:/subscriptions/transactions
     * @secure
     */
    getTransactionsSubscriptionsTransactionsGet: (params: RequestParams = {}) =>
      this.request<TransactionResponse[], any>({
        path: `/subscriptions/transactions`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description List all access tokens (admin).
     *
     * @tags Subscriptions
     * @name ListAccessTokensSubscriptionsTokensGet
     * @summary List Access Tokens
     * @request GET:/subscriptions/tokens
     * @secure
     */
    listAccessTokensSubscriptionsTokensGet: (params: RequestParams = {}) =>
      this.request<AccessTokenResponse[], any>({
        path: `/subscriptions/tokens`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Create an access token / voucher code (admin). The code is auto-generated (e.g. 'HEDB7'). Specify which package it grants and how many people can use it.
     *
     * @tags Subscriptions
     * @name CreateAccessTokenSubscriptionsTokensPost
     * @summary Create Access Token
     * @request POST:/subscriptions/tokens
     * @secure
     */
    createAccessTokenSubscriptionsTokensPost: (
      data: AccessTokenCreate,
      params: RequestParams = {},
    ) =>
      this.request<AccessTokenResponse, HTTPValidationError>({
        path: `/subscriptions/tokens`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Redeem an access token code to activate a subscription. User enters the code (e.g. 'HEDB7') and their phone number.
     *
     * @tags Subscriptions
     * @name RedeemAccessTokenSubscriptionsRedeemPost
     * @summary Redeem Access Token
     * @request POST:/subscriptions/redeem
     * @secure
     */
    redeemAccessTokenSubscriptionsRedeemPost: (
      data: RedeemTokenRequest,
      params: RequestParams = {},
    ) =>
      this.request<RedeemTokenResponse, HTTPValidationError>({
        path: `/subscriptions/redeem`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get the current user's access code redemption history.
     *
     * @tags Subscriptions
     * @name RedeemHistorySubscriptionsRedeemHistoryGet
     * @summary Redeem History
     * @request GET:/subscriptions/redeem-history
     * @secure
     */
    redeemHistorySubscriptionsRedeemHistoryGet: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/subscriptions/redeem-history`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Example protected endpoint — only accessible with a valid subscription.
     *
     * @tags Subscriptions
     * @name PremiumContentSubscriptionsPremiumContentGet
     * @summary Premium Content
     * @request GET:/subscriptions/premium-content
     * @secure
     */
    premiumContentSubscriptionsPremiumContentGet: (
      params: RequestParams = {},
    ) =>
      this.request<any, any>({
        path: `/subscriptions/premium-content`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
