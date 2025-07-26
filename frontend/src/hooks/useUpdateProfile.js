import React from 'react'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../lib/api";

const useUpdateProfile = () => {
    const queryClient = useQueryClient()
    
    const { mutate: updateProfileMutation, error, isPending } = useMutation({
        mutationFn: (profileData) => updateProfile(profileData),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['authUser'] })
        },
    })
    
    return { updateProfileMutation, error, isPending }
}

export default useUpdateProfile