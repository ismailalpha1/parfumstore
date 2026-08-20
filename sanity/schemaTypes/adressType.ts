import { HomeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const adressType = defineType({
    name:"adress",
    title:"Adresses",
    type:"document",
    icon: HomeIcon,
    fields: [
        defineField({
            name:"name",
            title:"Adress name",
            type:"string",
            description:"A name for this adress",
            validation:(Rule)=> Rule.required().max(50),
        }),
        defineField({
            name: "email",
            title: "User email",
            type:"email",
        }),
        defineField({
            name: "adress",
            title: "Street Address",
            type:"string",
            description: "The street adress including apartment number",
            validation: (Rule) => Rule.required().min(5).max(100),
        }),
        defineField({
            name: "city",
            title: "City",
            type:"string",
            validation:(Rule)=> Rule.required(),
        }),
        defineField({
            name: "zip",
            title: "Zip Code",
            type:"string",
            description:"Format: 12345",
            validation:(Rule) => 
                Rule.required()
                .regex(/^\d{5}(-\d{4})?$/, {
                    name: "zipCode",
                    invert: false,
                    })
                .custom((zip: string | undefined) => {
                    if (!zip) {
                        return "ZIP code is required";
                    }

                    if (!zip.match(/^\d{5}(-\d{4})?$/)) {
                        return "Please enter a valid ZIP code (e.g. 12345 or 12345-6789)";
                    }

                    return true;
                }),
        }),
        defineField({
            name:"default",
            title:"Default Adress",
            type:"boolean",
            description:'Is this the default shipping adress?',
            initialValue:false,
        }),
        defineField({
            name:"createdAt",
            title:"Created At",
            type:"datetime",
            initialValue: ()=> new Date().toISOString(),
        }),
    ],
    preview: {
        select: {
            title: "name",
            subtitle: "address",
            city:"city",
            isDefault:"default",
        },
        prepare({title, subtitle,city, isDefault}) {
            return {
                title: `${title} ${isDefault ? "(isDefault" : ""}`,
                subtitle: `${subtitle}, ${city}`
            }
        }
    }
})