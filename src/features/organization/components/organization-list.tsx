import { format } from "date-fns";

import { getOrganizationsByUser } from "../queries/get-organization-by-user";

const OrganizationList = async () => {
  const organizations = await getOrganizationsByUser();

  return (
    <div className="flex flex-1 flex-col gap-y-8">
      {organizations.map((organization) => (
        <div key={organization.id}>
          <div>Name: {organization.name}</div>
          <div>
            Joined At:{" "}
            {format(
              organization.membershipByUser.joinedAt,
              "yyyy-MM-dd, HH:mm",
            )}
          </div>
          <div>Members: {organization._count.memberships}</div>
        </div>
      ))}
    </div>
  );
};

export { OrganizationList };
