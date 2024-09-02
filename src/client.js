import  sanityClient  from "@sanity/client";
import imageUrlBuilder from '@sanity/image-url';

export const client =  sanityClient({           //Client is created with the following parameters the purpose of this client is to fetch the data from the sanity studio so that it can be displayed on the website
    projectId: process.env.REACT_APP_SANITY_PROJECT_ID,        //Project Id is the id of the project that is created in the sanity studio 
    dataset: 'production',                                     //Dataset is the dataset that is created in the sanity studio the purpose of this dataset is to store the data that is created in the sanity studio
    apiVersion:'2021-11-16',                                    //Api version is the version of the api that is used to fetch the data from the sanity studio
    useCdn: true,                                               //useCdn is a boolean value that is set to true so that the data can be fetched from the sanity studio
    token: process.env.REACT_APP_SANITY_TOKEN,                  //Token is the token that is used to authenticate the user so that the data can be fetched from the sanity studio
    ignoreBrowserTokenWarning: true,                            //ignoreBrowserTokenWarning is a boolean value that is set to true so that the browser token warning can be ignored , browser token warning is a warning that is displayed when the token is not valid
})

const builder = imageUrlBuilder(client);                        //Image url builder is created with the client that is created above so that the image url can be built

export const urlFor = (source) => builder.image(source);        //Url for is a function that is created with the source parameter so that the image url can be built with the source parameter