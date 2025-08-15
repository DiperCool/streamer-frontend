import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {
     useGetMyEmailQuery,

} from "@/graphql/__generated__/graphql";


export const EmailSettings = () => {
    const { data: email, loading: emailLoading  } = useGetMyEmailQuery();
    return(
        <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
                value={email?.myEmail.email}
                id="email"
                readOnly={true}
                type="email"
                className="bg-gray-700 border-gray-600 text-white focus:border-green-500"
            />
        </div>
    )
}