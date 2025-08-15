import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {
     useGetMyEmailQuery,

} from "@/graphql/__generated__/graphql";
import { Loader2 } from "lucide-react"; // Импортируем иконку спиннера

export const EmailSettings = () => {
    const { data: email, loading: emailLoading  } = useGetMyEmailQuery();
    return(
        <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            {emailLoading ? (
                <div className="flex items-center justify-center h-10 rounded-md border border-input bg-gray-700">
                    <Loader2 className="h-5 w-5 animate-spin text-green-500" />
                </div>
            ) : (
                <Input
                    value={email?.myEmail.email}
                    id="email"
                    readOnly={true}
                    type="email"
                    className="bg-gray-700 border-gray-600 text-white focus:border-green-500"
                />
            )}
        </div>
    )
}