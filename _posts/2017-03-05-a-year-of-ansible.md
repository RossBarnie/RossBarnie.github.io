---
layout: post
title: Working with Ansible for a year
description: Thoughts on working with Red Hat's Ansible server configuration management tool
---

[Ansible](https://www.ansible.com/) is a tool we used at
[tictoc](http://tictocdigital.co.uk) only sparingly about a year ago. A previous
developer had written the template of our current ansible projects but they
weren't quite ready for full production deployment.  When they left the company,
someone had to step up and take some control over the maintenance and
provisioning of new servers and since I was itching to do something other than
the standard Rails projects I'd been doing for about a year and a half at that
point, I decided to give it a go.

Learning Ansible was straightforward, especially as I was following [this
excellent Udemy course](https://www.udemy.com/mastering-ansible). My only
complaint about it was that the setup required Docker which I'm not familiar
with. Fortunately I knew Vagrant so could use that instead, even if my poor
MacBook did chug a bit while running a few different Ubuntu VMs at once. I put
the setup and my follow-along code in this [GitHub
repo](https://github.com/RossBarnie/mastering-ansible).

Number one priority was simplifying the "monolith" which had a lack of
documentation for variables, example usage, future plans etc. Initially I
created external roles for anything I felt could or should be separated. For us,
we require two distinct server skeletons, one for the current version of our
CMS, and one for the legacy version which a few clients are still using.
There are various system-level dependencies between these two skeletons so it
seemed logical for me to separate them into their own Ansible Playbook projects.
Most of the setup such as remote access policy, backup solution, firewall etc.
are common between the two skeletons or require slightly different
configuration. Initially I created 4 projects: `current-cms-application`,
`current-cms-database`, `legacy-application`, and `legacy-database`. Each of
these playbooks used our now-separated roles to provision them, however I
noticed a large amount of code reuse between the `database` and `application`
projects, as well as the database projects being incredibly small when
discounting the reused code. I eventually realised I could have accomplished the
same separation of database and application with Ansible
[groups](http://docs.ansible.com/ansible/intro_inventory.html#hosts-and-groups).
While this is incredibly obvious to me now, at the time this was a revelation,
both in Ansible terms and more generally as a reminder to KISS. We now have a
`current-cms-servers` and `legacy-cms-servers` and is much more simple to
maintain as a result, especially now that we also have eight ansible roles, with
all variables documented.

New servers are now configured by a new Ansible script that utilises all of
these roles, and within the last month we completely replaced an older server
with one managed by Ansible. I am extremely proud of what I've managed to
accomplish, essentially starting from zero knowledge of server management to a
completely managed solution that, crucially, other developers are using. It's an
entirely new skillset and one I'm glad I've taken the time to learn. Of course
there are many plans for the future of these projects, and I'm far from finished
learning about how to manage servers, but so far it's been extremely worthwhile,
both from a personal, and from a professional standpoint. It's allowing us to
respond to security threats, upgrade vulnerable packages, and block incoming
attacks with a single command and minimal development time, giving us more time
to focus on making our clients' websites better.

While I was transparent among the dev team at tictoc about what I was doing and
why, other departments didn't really know what I was doing, only that I was
doing something to do with the servers, so they asked me to write a blog about
it, which you can find
[here](http://www.tictocdigital.co.uk/latest/29-ansible-the-answer-to-managing-multiple-servers).
