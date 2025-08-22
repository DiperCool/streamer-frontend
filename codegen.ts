import type { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
    overwrite: true,
    schema: process.env.NEXT_PUBLIC_GRAPHQL_URL || "https://localhost:5001/graphql",
    documents: 'graphql/**/*.{ts,tsx,graphql,gql}',
    generates: {
        "graphql/__generated__/graphql.ts": {
            plugins: [
                "typescript",
                "typescript-operations",
                "typescript-react-apollo"
            ],
            config: {
                withHooks: true,
                withHOC: false,
                withComponent: false,
                reactApolloVersion: 3,
                dedupeFragments: true,
                useTypeImports: true,
                scalars: {
                    UUID: 'string',
                    DateTime: 'string',
                    Long: 'number',
                },
            },
        },
    },
    config: {
        dedupeFragments: true,
        useTypeImports: true,
        scalars: {
            UUID: 'string',
            DateTime: 'string',
            Long: 'number',
        },
    },
}

export default config