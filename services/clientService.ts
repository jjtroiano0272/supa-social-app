import { supabase } from "@/lib/supabase";
import { Client } from "@/types/globals";

export const searchForClient = async (text: string) => {
  try {
    const firstName = text.split(" ")[0];
    const lastName = text.split(" ")[0];

    const { data, error } = await supabase
      .from("clients")
      .select()
      //   Selecting the drop-down client works to hide results when this has no space in it
      //   A)
      //   .or(`first_name.ilike.%${text}%,last_name.ilike.%${text}%`);
      //   B)
      //   .or(
      //     text
      //       .split(" ") // Split the search term into individual words
      //       .map(
      //         (word) =>
      //           `first_name.ilike.%${word}%` + `,last_name.ilike.%${word}%` // Check both first_name and last_name for each word
      //       )
      //       .join(",") // Combine each condition with an OR
      //   );
      // C)
      .or(`first_name.ilike.%${firstName}%,last_name.ilike.%${lastName}%`);

    console.log(`data in fetchClientData: ${JSON.stringify(data, null, 2)}`);

    if (error) {
      console.log(
        `Error searching clients in getClientData method: ${JSON.stringify(
          error,
          null,
          2
        )}`
      );
      return { success: false, msg: error.message };
    }

    return { success: true, data: data };
  } catch (error: any) {
    console.log(
      `Error searching clients in getClientData method: ${JSON.stringify(
        error,
        null,
        2
      )}`
    );

    return { success: false, msg: error.message };
  }
};

export const createOrUpdateClient = async (client: Client) => {
  try {
    // A)
    // const { data, error } = await supabase.from("clients").upsert(client);
    //   .select()
    //   .single();

    // B)
    const { data, error } = await supabase
      .from("clients")
      .upsert(client)
      .select()
      .single();

    if (error) {
      console.error(`createOrUpdateClient error: `, error);
    }

    console.log(`createOrUpdateClient data: ${JSON.stringify(data, null, 2)}`);

    return { success: true, data: data };
  } catch (error) {
    console.error(`createOrUpdateClient error: `, error);
    return { success: false, msg: "Could not create the client" };
  }
};

export const createClient = async (client: Client) => {
  try {
    const { data, error } = await supabase
      .from("clients")
      .insert(client)
      .select()
      .single();

    if (error) {
      console.error(`createClient error: `, error);
    }

    return { success: true, data: data };
  } catch (error) {
    console.error(`createClient error: `, error);
    return { success: false, msg: "Could not create the client" };
  }
};

export const fetchClientDetails = async (id: number | string) => {
  try {
    const { data, error } = await supabase
      .from("clients")
      .select(
        `
        *
        `
      )
      .eq("id", id)
      .single();

    if (error) {
      error.code != "22P02" &&
        console.error(`fetchClientDetails error: `, error);
      return { success: false, msg: "Could not fetch client details" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.error(`fetchPost error: `, error);
    return { success: false, msg: "Could not fetch client details" };
  }
};
