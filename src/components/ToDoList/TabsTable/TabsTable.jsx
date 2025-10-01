import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Box, Text } from "@radix-ui/themes";
import ProcessTable from "../ProcessTable/ProcessTable";

export default function TabsTable() {
  return (
    <div className="w-[95%] mx-auto mt-8 p-4 text-[#1243AF] shadow hover:shadow-2xl rounded-2xl">
      <div className="flex gap-2">
        <div>
          <div className="w-[60px] h-[60px] bg-red-500 rounded-full"></div>
        </div>
        <div>
          <h1 className="text-3xl">My List</h1>
          <Tabs.Root defaultValue="account">
            <Tabs.List className="flex gap-6 pb-2 border-b-2">
              <Tabs.Trigger value="account" className="cursor-pointer">Account</Tabs.Trigger>
              <Tabs.Trigger value="documents" className="cursor-pointer">Documents</Tabs.Trigger>
              <Tabs.Trigger value="settings" className="cursor-pointer">Settings</Tabs.Trigger>
            </Tabs.List>

            <Box pt="3">
              <Tabs.Content value="account">
                    <ProcessTable/>
              </Tabs.Content>

              <Tabs.Content value="documents">
                <Text size="2">Access and update your documents.</Text>
              </Tabs.Content>

              <Tabs.Content value="settings">
                <Text size="2">
                  Edit your profile or update contact information.
                </Text>
              </Tabs.Content>
            </Box>
          </Tabs.Root>
        </div>
      </div>
    </div>
  );
}
