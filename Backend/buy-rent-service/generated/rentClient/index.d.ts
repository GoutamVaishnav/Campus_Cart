
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model RentProducts
 * 
 */
export type RentProducts = $Result.DefaultSelection<Prisma.$RentProductsPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more RentProducts
 * const rentProducts = await prisma.rentProducts.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more RentProducts
   * const rentProducts = await prisma.rentProducts.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.rentProducts`: Exposes CRUD operations for the **RentProducts** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RentProducts
    * const rentProducts = await prisma.rentProducts.findMany()
    * ```
    */
  get rentProducts(): Prisma.RentProductsDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    RentProducts: 'RentProducts'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "rentProducts"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      RentProducts: {
        payload: Prisma.$RentProductsPayload<ExtArgs>
        fields: Prisma.RentProductsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RentProductsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RentProductsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RentProductsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RentProductsPayload>
          }
          findFirst: {
            args: Prisma.RentProductsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RentProductsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RentProductsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RentProductsPayload>
          }
          findMany: {
            args: Prisma.RentProductsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RentProductsPayload>[]
          }
          create: {
            args: Prisma.RentProductsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RentProductsPayload>
          }
          createMany: {
            args: Prisma.RentProductsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RentProductsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RentProductsPayload>[]
          }
          delete: {
            args: Prisma.RentProductsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RentProductsPayload>
          }
          update: {
            args: Prisma.RentProductsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RentProductsPayload>
          }
          deleteMany: {
            args: Prisma.RentProductsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RentProductsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RentProductsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RentProductsPayload>
          }
          aggregate: {
            args: Prisma.RentProductsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRentProducts>
          }
          groupBy: {
            args: Prisma.RentProductsGroupByArgs<ExtArgs>
            result: $Utils.Optional<RentProductsGroupByOutputType>[]
          }
          count: {
            args: Prisma.RentProductsCountArgs<ExtArgs>
            result: $Utils.Optional<RentProductsCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model RentProducts
   */

  export type AggregateRentProducts = {
    _count: RentProductsCountAggregateOutputType | null
    _avg: RentProductsAvgAggregateOutputType | null
    _sum: RentProductsSumAggregateOutputType | null
    _min: RentProductsMinAggregateOutputType | null
    _max: RentProductsMaxAggregateOutputType | null
  }

  export type RentProductsAvgAggregateOutputType = {
    product_id: number | null
    price_per_day: number | null
  }

  export type RentProductsSumAggregateOutputType = {
    product_id: number | null
    price_per_day: number | null
  }

  export type RentProductsMinAggregateOutputType = {
    product_id: number | null
    title: string | null
    description: string | null
    price_per_day: number | null
    college: string | null
    category: string | null
    location: string | null
    type: string | null
    seller_id: string | null
    seller_name: string | null
    created_at: Date | null
  }

  export type RentProductsMaxAggregateOutputType = {
    product_id: number | null
    title: string | null
    description: string | null
    price_per_day: number | null
    college: string | null
    category: string | null
    location: string | null
    type: string | null
    seller_id: string | null
    seller_name: string | null
    created_at: Date | null
  }

  export type RentProductsCountAggregateOutputType = {
    product_id: number
    title: number
    description: number
    price_per_day: number
    college: number
    category: number
    location: number
    type: number
    seller_id: number
    seller_name: number
    image_urls: number
    created_at: number
    _all: number
  }


  export type RentProductsAvgAggregateInputType = {
    product_id?: true
    price_per_day?: true
  }

  export type RentProductsSumAggregateInputType = {
    product_id?: true
    price_per_day?: true
  }

  export type RentProductsMinAggregateInputType = {
    product_id?: true
    title?: true
    description?: true
    price_per_day?: true
    college?: true
    category?: true
    location?: true
    type?: true
    seller_id?: true
    seller_name?: true
    created_at?: true
  }

  export type RentProductsMaxAggregateInputType = {
    product_id?: true
    title?: true
    description?: true
    price_per_day?: true
    college?: true
    category?: true
    location?: true
    type?: true
    seller_id?: true
    seller_name?: true
    created_at?: true
  }

  export type RentProductsCountAggregateInputType = {
    product_id?: true
    title?: true
    description?: true
    price_per_day?: true
    college?: true
    category?: true
    location?: true
    type?: true
    seller_id?: true
    seller_name?: true
    image_urls?: true
    created_at?: true
    _all?: true
  }

  export type RentProductsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RentProducts to aggregate.
     */
    where?: RentProductsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RentProducts to fetch.
     */
    orderBy?: RentProductsOrderByWithRelationInput | RentProductsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RentProductsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RentProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RentProducts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RentProducts
    **/
    _count?: true | RentProductsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RentProductsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RentProductsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RentProductsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RentProductsMaxAggregateInputType
  }

  export type GetRentProductsAggregateType<T extends RentProductsAggregateArgs> = {
        [P in keyof T & keyof AggregateRentProducts]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRentProducts[P]>
      : GetScalarType<T[P], AggregateRentProducts[P]>
  }




  export type RentProductsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RentProductsWhereInput
    orderBy?: RentProductsOrderByWithAggregationInput | RentProductsOrderByWithAggregationInput[]
    by: RentProductsScalarFieldEnum[] | RentProductsScalarFieldEnum
    having?: RentProductsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RentProductsCountAggregateInputType | true
    _avg?: RentProductsAvgAggregateInputType
    _sum?: RentProductsSumAggregateInputType
    _min?: RentProductsMinAggregateInputType
    _max?: RentProductsMaxAggregateInputType
  }

  export type RentProductsGroupByOutputType = {
    product_id: number
    title: string
    description: string
    price_per_day: number
    college: string
    category: string
    location: string
    type: string
    seller_id: string
    seller_name: string
    image_urls: string[]
    created_at: Date
    _count: RentProductsCountAggregateOutputType | null
    _avg: RentProductsAvgAggregateOutputType | null
    _sum: RentProductsSumAggregateOutputType | null
    _min: RentProductsMinAggregateOutputType | null
    _max: RentProductsMaxAggregateOutputType | null
  }

  type GetRentProductsGroupByPayload<T extends RentProductsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RentProductsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RentProductsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RentProductsGroupByOutputType[P]>
            : GetScalarType<T[P], RentProductsGroupByOutputType[P]>
        }
      >
    >


  export type RentProductsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    product_id?: boolean
    title?: boolean
    description?: boolean
    price_per_day?: boolean
    college?: boolean
    category?: boolean
    location?: boolean
    type?: boolean
    seller_id?: boolean
    seller_name?: boolean
    image_urls?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["rentProducts"]>

  export type RentProductsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    product_id?: boolean
    title?: boolean
    description?: boolean
    price_per_day?: boolean
    college?: boolean
    category?: boolean
    location?: boolean
    type?: boolean
    seller_id?: boolean
    seller_name?: boolean
    image_urls?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["rentProducts"]>

  export type RentProductsSelectScalar = {
    product_id?: boolean
    title?: boolean
    description?: boolean
    price_per_day?: boolean
    college?: boolean
    category?: boolean
    location?: boolean
    type?: boolean
    seller_id?: boolean
    seller_name?: boolean
    image_urls?: boolean
    created_at?: boolean
  }


  export type $RentProductsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RentProducts"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      product_id: number
      title: string
      description: string
      price_per_day: number
      college: string
      category: string
      location: string
      type: string
      seller_id: string
      seller_name: string
      image_urls: string[]
      created_at: Date
    }, ExtArgs["result"]["rentProducts"]>
    composites: {}
  }

  type RentProductsGetPayload<S extends boolean | null | undefined | RentProductsDefaultArgs> = $Result.GetResult<Prisma.$RentProductsPayload, S>

  type RentProductsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RentProductsFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RentProductsCountAggregateInputType | true
    }

  export interface RentProductsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RentProducts'], meta: { name: 'RentProducts' } }
    /**
     * Find zero or one RentProducts that matches the filter.
     * @param {RentProductsFindUniqueArgs} args - Arguments to find a RentProducts
     * @example
     * // Get one RentProducts
     * const rentProducts = await prisma.rentProducts.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RentProductsFindUniqueArgs>(args: SelectSubset<T, RentProductsFindUniqueArgs<ExtArgs>>): Prisma__RentProductsClient<$Result.GetResult<Prisma.$RentProductsPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one RentProducts that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RentProductsFindUniqueOrThrowArgs} args - Arguments to find a RentProducts
     * @example
     * // Get one RentProducts
     * const rentProducts = await prisma.rentProducts.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RentProductsFindUniqueOrThrowArgs>(args: SelectSubset<T, RentProductsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RentProductsClient<$Result.GetResult<Prisma.$RentProductsPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first RentProducts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RentProductsFindFirstArgs} args - Arguments to find a RentProducts
     * @example
     * // Get one RentProducts
     * const rentProducts = await prisma.rentProducts.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RentProductsFindFirstArgs>(args?: SelectSubset<T, RentProductsFindFirstArgs<ExtArgs>>): Prisma__RentProductsClient<$Result.GetResult<Prisma.$RentProductsPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first RentProducts that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RentProductsFindFirstOrThrowArgs} args - Arguments to find a RentProducts
     * @example
     * // Get one RentProducts
     * const rentProducts = await prisma.rentProducts.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RentProductsFindFirstOrThrowArgs>(args?: SelectSubset<T, RentProductsFindFirstOrThrowArgs<ExtArgs>>): Prisma__RentProductsClient<$Result.GetResult<Prisma.$RentProductsPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more RentProducts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RentProductsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RentProducts
     * const rentProducts = await prisma.rentProducts.findMany()
     * 
     * // Get first 10 RentProducts
     * const rentProducts = await prisma.rentProducts.findMany({ take: 10 })
     * 
     * // Only select the `product_id`
     * const rentProductsWithProduct_idOnly = await prisma.rentProducts.findMany({ select: { product_id: true } })
     * 
     */
    findMany<T extends RentProductsFindManyArgs>(args?: SelectSubset<T, RentProductsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RentProductsPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a RentProducts.
     * @param {RentProductsCreateArgs} args - Arguments to create a RentProducts.
     * @example
     * // Create one RentProducts
     * const RentProducts = await prisma.rentProducts.create({
     *   data: {
     *     // ... data to create a RentProducts
     *   }
     * })
     * 
     */
    create<T extends RentProductsCreateArgs>(args: SelectSubset<T, RentProductsCreateArgs<ExtArgs>>): Prisma__RentProductsClient<$Result.GetResult<Prisma.$RentProductsPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many RentProducts.
     * @param {RentProductsCreateManyArgs} args - Arguments to create many RentProducts.
     * @example
     * // Create many RentProducts
     * const rentProducts = await prisma.rentProducts.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RentProductsCreateManyArgs>(args?: SelectSubset<T, RentProductsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RentProducts and returns the data saved in the database.
     * @param {RentProductsCreateManyAndReturnArgs} args - Arguments to create many RentProducts.
     * @example
     * // Create many RentProducts
     * const rentProducts = await prisma.rentProducts.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RentProducts and only return the `product_id`
     * const rentProductsWithProduct_idOnly = await prisma.rentProducts.createManyAndReturn({ 
     *   select: { product_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RentProductsCreateManyAndReturnArgs>(args?: SelectSubset<T, RentProductsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RentProductsPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a RentProducts.
     * @param {RentProductsDeleteArgs} args - Arguments to delete one RentProducts.
     * @example
     * // Delete one RentProducts
     * const RentProducts = await prisma.rentProducts.delete({
     *   where: {
     *     // ... filter to delete one RentProducts
     *   }
     * })
     * 
     */
    delete<T extends RentProductsDeleteArgs>(args: SelectSubset<T, RentProductsDeleteArgs<ExtArgs>>): Prisma__RentProductsClient<$Result.GetResult<Prisma.$RentProductsPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one RentProducts.
     * @param {RentProductsUpdateArgs} args - Arguments to update one RentProducts.
     * @example
     * // Update one RentProducts
     * const rentProducts = await prisma.rentProducts.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RentProductsUpdateArgs>(args: SelectSubset<T, RentProductsUpdateArgs<ExtArgs>>): Prisma__RentProductsClient<$Result.GetResult<Prisma.$RentProductsPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more RentProducts.
     * @param {RentProductsDeleteManyArgs} args - Arguments to filter RentProducts to delete.
     * @example
     * // Delete a few RentProducts
     * const { count } = await prisma.rentProducts.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RentProductsDeleteManyArgs>(args?: SelectSubset<T, RentProductsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RentProducts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RentProductsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RentProducts
     * const rentProducts = await prisma.rentProducts.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RentProductsUpdateManyArgs>(args: SelectSubset<T, RentProductsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one RentProducts.
     * @param {RentProductsUpsertArgs} args - Arguments to update or create a RentProducts.
     * @example
     * // Update or create a RentProducts
     * const rentProducts = await prisma.rentProducts.upsert({
     *   create: {
     *     // ... data to create a RentProducts
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RentProducts we want to update
     *   }
     * })
     */
    upsert<T extends RentProductsUpsertArgs>(args: SelectSubset<T, RentProductsUpsertArgs<ExtArgs>>): Prisma__RentProductsClient<$Result.GetResult<Prisma.$RentProductsPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of RentProducts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RentProductsCountArgs} args - Arguments to filter RentProducts to count.
     * @example
     * // Count the number of RentProducts
     * const count = await prisma.rentProducts.count({
     *   where: {
     *     // ... the filter for the RentProducts we want to count
     *   }
     * })
    **/
    count<T extends RentProductsCountArgs>(
      args?: Subset<T, RentProductsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RentProductsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RentProducts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RentProductsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RentProductsAggregateArgs>(args: Subset<T, RentProductsAggregateArgs>): Prisma.PrismaPromise<GetRentProductsAggregateType<T>>

    /**
     * Group by RentProducts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RentProductsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RentProductsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RentProductsGroupByArgs['orderBy'] }
        : { orderBy?: RentProductsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RentProductsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRentProductsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RentProducts model
   */
  readonly fields: RentProductsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RentProducts.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RentProductsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RentProducts model
   */ 
  interface RentProductsFieldRefs {
    readonly product_id: FieldRef<"RentProducts", 'Int'>
    readonly title: FieldRef<"RentProducts", 'String'>
    readonly description: FieldRef<"RentProducts", 'String'>
    readonly price_per_day: FieldRef<"RentProducts", 'Int'>
    readonly college: FieldRef<"RentProducts", 'String'>
    readonly category: FieldRef<"RentProducts", 'String'>
    readonly location: FieldRef<"RentProducts", 'String'>
    readonly type: FieldRef<"RentProducts", 'String'>
    readonly seller_id: FieldRef<"RentProducts", 'String'>
    readonly seller_name: FieldRef<"RentProducts", 'String'>
    readonly image_urls: FieldRef<"RentProducts", 'String[]'>
    readonly created_at: FieldRef<"RentProducts", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RentProducts findUnique
   */
  export type RentProductsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RentProducts
     */
    select?: RentProductsSelect<ExtArgs> | null
    /**
     * Filter, which RentProducts to fetch.
     */
    where: RentProductsWhereUniqueInput
  }

  /**
   * RentProducts findUniqueOrThrow
   */
  export type RentProductsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RentProducts
     */
    select?: RentProductsSelect<ExtArgs> | null
    /**
     * Filter, which RentProducts to fetch.
     */
    where: RentProductsWhereUniqueInput
  }

  /**
   * RentProducts findFirst
   */
  export type RentProductsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RentProducts
     */
    select?: RentProductsSelect<ExtArgs> | null
    /**
     * Filter, which RentProducts to fetch.
     */
    where?: RentProductsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RentProducts to fetch.
     */
    orderBy?: RentProductsOrderByWithRelationInput | RentProductsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RentProducts.
     */
    cursor?: RentProductsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RentProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RentProducts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RentProducts.
     */
    distinct?: RentProductsScalarFieldEnum | RentProductsScalarFieldEnum[]
  }

  /**
   * RentProducts findFirstOrThrow
   */
  export type RentProductsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RentProducts
     */
    select?: RentProductsSelect<ExtArgs> | null
    /**
     * Filter, which RentProducts to fetch.
     */
    where?: RentProductsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RentProducts to fetch.
     */
    orderBy?: RentProductsOrderByWithRelationInput | RentProductsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RentProducts.
     */
    cursor?: RentProductsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RentProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RentProducts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RentProducts.
     */
    distinct?: RentProductsScalarFieldEnum | RentProductsScalarFieldEnum[]
  }

  /**
   * RentProducts findMany
   */
  export type RentProductsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RentProducts
     */
    select?: RentProductsSelect<ExtArgs> | null
    /**
     * Filter, which RentProducts to fetch.
     */
    where?: RentProductsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RentProducts to fetch.
     */
    orderBy?: RentProductsOrderByWithRelationInput | RentProductsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RentProducts.
     */
    cursor?: RentProductsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RentProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RentProducts.
     */
    skip?: number
    distinct?: RentProductsScalarFieldEnum | RentProductsScalarFieldEnum[]
  }

  /**
   * RentProducts create
   */
  export type RentProductsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RentProducts
     */
    select?: RentProductsSelect<ExtArgs> | null
    /**
     * The data needed to create a RentProducts.
     */
    data: XOR<RentProductsCreateInput, RentProductsUncheckedCreateInput>
  }

  /**
   * RentProducts createMany
   */
  export type RentProductsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RentProducts.
     */
    data: RentProductsCreateManyInput | RentProductsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RentProducts createManyAndReturn
   */
  export type RentProductsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RentProducts
     */
    select?: RentProductsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many RentProducts.
     */
    data: RentProductsCreateManyInput | RentProductsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RentProducts update
   */
  export type RentProductsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RentProducts
     */
    select?: RentProductsSelect<ExtArgs> | null
    /**
     * The data needed to update a RentProducts.
     */
    data: XOR<RentProductsUpdateInput, RentProductsUncheckedUpdateInput>
    /**
     * Choose, which RentProducts to update.
     */
    where: RentProductsWhereUniqueInput
  }

  /**
   * RentProducts updateMany
   */
  export type RentProductsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RentProducts.
     */
    data: XOR<RentProductsUpdateManyMutationInput, RentProductsUncheckedUpdateManyInput>
    /**
     * Filter which RentProducts to update
     */
    where?: RentProductsWhereInput
  }

  /**
   * RentProducts upsert
   */
  export type RentProductsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RentProducts
     */
    select?: RentProductsSelect<ExtArgs> | null
    /**
     * The filter to search for the RentProducts to update in case it exists.
     */
    where: RentProductsWhereUniqueInput
    /**
     * In case the RentProducts found by the `where` argument doesn't exist, create a new RentProducts with this data.
     */
    create: XOR<RentProductsCreateInput, RentProductsUncheckedCreateInput>
    /**
     * In case the RentProducts was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RentProductsUpdateInput, RentProductsUncheckedUpdateInput>
  }

  /**
   * RentProducts delete
   */
  export type RentProductsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RentProducts
     */
    select?: RentProductsSelect<ExtArgs> | null
    /**
     * Filter which RentProducts to delete.
     */
    where: RentProductsWhereUniqueInput
  }

  /**
   * RentProducts deleteMany
   */
  export type RentProductsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RentProducts to delete
     */
    where?: RentProductsWhereInput
  }

  /**
   * RentProducts without action
   */
  export type RentProductsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RentProducts
     */
    select?: RentProductsSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const RentProductsScalarFieldEnum: {
    product_id: 'product_id',
    title: 'title',
    description: 'description',
    price_per_day: 'price_per_day',
    college: 'college',
    category: 'category',
    location: 'location',
    type: 'type',
    seller_id: 'seller_id',
    seller_name: 'seller_name',
    image_urls: 'image_urls',
    created_at: 'created_at'
  };

  export type RentProductsScalarFieldEnum = (typeof RentProductsScalarFieldEnum)[keyof typeof RentProductsScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type RentProductsWhereInput = {
    AND?: RentProductsWhereInput | RentProductsWhereInput[]
    OR?: RentProductsWhereInput[]
    NOT?: RentProductsWhereInput | RentProductsWhereInput[]
    product_id?: IntFilter<"RentProducts"> | number
    title?: StringFilter<"RentProducts"> | string
    description?: StringFilter<"RentProducts"> | string
    price_per_day?: IntFilter<"RentProducts"> | number
    college?: StringFilter<"RentProducts"> | string
    category?: StringFilter<"RentProducts"> | string
    location?: StringFilter<"RentProducts"> | string
    type?: StringFilter<"RentProducts"> | string
    seller_id?: StringFilter<"RentProducts"> | string
    seller_name?: StringFilter<"RentProducts"> | string
    image_urls?: StringNullableListFilter<"RentProducts">
    created_at?: DateTimeFilter<"RentProducts"> | Date | string
  }

  export type RentProductsOrderByWithRelationInput = {
    product_id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    price_per_day?: SortOrder
    college?: SortOrder
    category?: SortOrder
    location?: SortOrder
    type?: SortOrder
    seller_id?: SortOrder
    seller_name?: SortOrder
    image_urls?: SortOrder
    created_at?: SortOrder
  }

  export type RentProductsWhereUniqueInput = Prisma.AtLeast<{
    product_id?: number
    AND?: RentProductsWhereInput | RentProductsWhereInput[]
    OR?: RentProductsWhereInput[]
    NOT?: RentProductsWhereInput | RentProductsWhereInput[]
    title?: StringFilter<"RentProducts"> | string
    description?: StringFilter<"RentProducts"> | string
    price_per_day?: IntFilter<"RentProducts"> | number
    college?: StringFilter<"RentProducts"> | string
    category?: StringFilter<"RentProducts"> | string
    location?: StringFilter<"RentProducts"> | string
    type?: StringFilter<"RentProducts"> | string
    seller_id?: StringFilter<"RentProducts"> | string
    seller_name?: StringFilter<"RentProducts"> | string
    image_urls?: StringNullableListFilter<"RentProducts">
    created_at?: DateTimeFilter<"RentProducts"> | Date | string
  }, "product_id">

  export type RentProductsOrderByWithAggregationInput = {
    product_id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    price_per_day?: SortOrder
    college?: SortOrder
    category?: SortOrder
    location?: SortOrder
    type?: SortOrder
    seller_id?: SortOrder
    seller_name?: SortOrder
    image_urls?: SortOrder
    created_at?: SortOrder
    _count?: RentProductsCountOrderByAggregateInput
    _avg?: RentProductsAvgOrderByAggregateInput
    _max?: RentProductsMaxOrderByAggregateInput
    _min?: RentProductsMinOrderByAggregateInput
    _sum?: RentProductsSumOrderByAggregateInput
  }

  export type RentProductsScalarWhereWithAggregatesInput = {
    AND?: RentProductsScalarWhereWithAggregatesInput | RentProductsScalarWhereWithAggregatesInput[]
    OR?: RentProductsScalarWhereWithAggregatesInput[]
    NOT?: RentProductsScalarWhereWithAggregatesInput | RentProductsScalarWhereWithAggregatesInput[]
    product_id?: IntWithAggregatesFilter<"RentProducts"> | number
    title?: StringWithAggregatesFilter<"RentProducts"> | string
    description?: StringWithAggregatesFilter<"RentProducts"> | string
    price_per_day?: IntWithAggregatesFilter<"RentProducts"> | number
    college?: StringWithAggregatesFilter<"RentProducts"> | string
    category?: StringWithAggregatesFilter<"RentProducts"> | string
    location?: StringWithAggregatesFilter<"RentProducts"> | string
    type?: StringWithAggregatesFilter<"RentProducts"> | string
    seller_id?: StringWithAggregatesFilter<"RentProducts"> | string
    seller_name?: StringWithAggregatesFilter<"RentProducts"> | string
    image_urls?: StringNullableListFilter<"RentProducts">
    created_at?: DateTimeWithAggregatesFilter<"RentProducts"> | Date | string
  }

  export type RentProductsCreateInput = {
    title: string
    description: string
    price_per_day: number
    college: string
    category: string
    location: string
    type?: string
    seller_id: string
    seller_name: string
    image_urls?: RentProductsCreateimage_urlsInput | string[]
    created_at?: Date | string
  }

  export type RentProductsUncheckedCreateInput = {
    product_id?: number
    title: string
    description: string
    price_per_day: number
    college: string
    category: string
    location: string
    type?: string
    seller_id: string
    seller_name: string
    image_urls?: RentProductsCreateimage_urlsInput | string[]
    created_at?: Date | string
  }

  export type RentProductsUpdateInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price_per_day?: IntFieldUpdateOperationsInput | number
    college?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    seller_id?: StringFieldUpdateOperationsInput | string
    seller_name?: StringFieldUpdateOperationsInput | string
    image_urls?: RentProductsUpdateimage_urlsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RentProductsUncheckedUpdateInput = {
    product_id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price_per_day?: IntFieldUpdateOperationsInput | number
    college?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    seller_id?: StringFieldUpdateOperationsInput | string
    seller_name?: StringFieldUpdateOperationsInput | string
    image_urls?: RentProductsUpdateimage_urlsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RentProductsCreateManyInput = {
    product_id?: number
    title: string
    description: string
    price_per_day: number
    college: string
    category: string
    location: string
    type?: string
    seller_id: string
    seller_name: string
    image_urls?: RentProductsCreateimage_urlsInput | string[]
    created_at?: Date | string
  }

  export type RentProductsUpdateManyMutationInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price_per_day?: IntFieldUpdateOperationsInput | number
    college?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    seller_id?: StringFieldUpdateOperationsInput | string
    seller_name?: StringFieldUpdateOperationsInput | string
    image_urls?: RentProductsUpdateimage_urlsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RentProductsUncheckedUpdateManyInput = {
    product_id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price_per_day?: IntFieldUpdateOperationsInput | number
    college?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    location?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    seller_id?: StringFieldUpdateOperationsInput | string
    seller_name?: StringFieldUpdateOperationsInput | string
    image_urls?: RentProductsUpdateimage_urlsInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type RentProductsCountOrderByAggregateInput = {
    product_id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    price_per_day?: SortOrder
    college?: SortOrder
    category?: SortOrder
    location?: SortOrder
    type?: SortOrder
    seller_id?: SortOrder
    seller_name?: SortOrder
    image_urls?: SortOrder
    created_at?: SortOrder
  }

  export type RentProductsAvgOrderByAggregateInput = {
    product_id?: SortOrder
    price_per_day?: SortOrder
  }

  export type RentProductsMaxOrderByAggregateInput = {
    product_id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    price_per_day?: SortOrder
    college?: SortOrder
    category?: SortOrder
    location?: SortOrder
    type?: SortOrder
    seller_id?: SortOrder
    seller_name?: SortOrder
    created_at?: SortOrder
  }

  export type RentProductsMinOrderByAggregateInput = {
    product_id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    price_per_day?: SortOrder
    college?: SortOrder
    category?: SortOrder
    location?: SortOrder
    type?: SortOrder
    seller_id?: SortOrder
    seller_name?: SortOrder
    created_at?: SortOrder
  }

  export type RentProductsSumOrderByAggregateInput = {
    product_id?: SortOrder
    price_per_day?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type RentProductsCreateimage_urlsInput = {
    set: string[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type RentProductsUpdateimage_urlsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use RentProductsDefaultArgs instead
     */
    export type RentProductsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RentProductsDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}