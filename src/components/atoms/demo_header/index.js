import React from "react";
import { Header } from "@teamfabric/copilot-ui";

function DemoHeader() {
  return (
    <Header
      company="fabric"
      className="demo_header"
      logo={{
        height: "24px",
        url: "",
        width: "24px",
      }}
      onClick={function noRefCheck() {}}
      productLinks={[
        {
          href: "/shopdesk",
          icon: "Overview",
          text: "Shopdesk",
        },
      ]}
      userData={{
        userEmail: "tiffany.doe@jcrew.com",
        userName: "Tiffany Doe",
        userNav: [
          {
            label: "Edit Profile",
            link: "/",
          },
          {
            label: "Preferences",
            link: "/",
          },
          {
            label: "Logout",
            link: "/",
          },
        ],
      }}
    />
  );
}

export default DemoHeader;
