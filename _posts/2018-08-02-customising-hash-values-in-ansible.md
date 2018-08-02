---
layout: post
title: Overriding hash values in Ansible roles
description: I propose a solution to customising individual values of a hash in Ansible
---

Something I have avoided in my ansible roles is using hash variables to define user-configurable values.
This is largely because of how Ansible treats hashes.
To explain the problem and my solution to it, I will create a hypothetical role that installs postgresql, with the correct package name for Debian and RedHat systems.
Have a look at this [pull request](https://github.com/Icinga/ansible-icinga2/commit/0fd8afea4ff807eda5c2d3b51f98eea509150bfa) for a real-world application of the solution.

The problem
---

In `tasks/main.yml`:

```yaml
---
- name: Install postgresql (apt)
  apt:
    {% raw %}pkg: "{{ postgres_package["apt"] }}"{% endraw %}
    state: present

- name: Install postgresql (yum)
  yum:
    pkg: {% raw %}"{{ postgres_package["yum"] }}"{% endraw %}
    state: present
```

(Absolutely not condoning this method of installing packages, this is just for illustration!)

In `defaults/main.yml`:
```yaml
---
postgres_package:
  apt: postgresql-9.6
  yum: postgresql96-server
```

If I, as a user of this role, wanted to update only the `apt` package, I could write something like the following in `group_vars/all.yml`:
```yaml
---
postgres_package:
  apt: postgresql-10
```

However, now the entire `postgres_package` hash resolves to the following:
```python
{ "postgres_package" : { "apt" : "postgresql-10" } }
```

The yum key is missing because the entire hash has been overwritten, so if we were to run the role the `Install postgresql (yum)` task it would fail due to the undefined `yum` key.
We can see from the Ansible documentation for [`DEFAULT_HASH_BEHAVIOUR`](https://docs.ansible.com/ansible/latest/reference_appendices/config.html#default-hash-behaviour) that Ansible does not merge hashes when resolving variable definitions by default:

> By default Ansible will override variables in specific precedence orders, as described in Variables. When a variable of higher precedence wins, it will replace the other value. Some users prefer that variables that are hashes (aka ‘dictionaries’ in Python terms) are merged. This setting is called ‘merge’. This is not the default behavior... We generally recommend not using this setting.

So you *can* change the behaviour so that the hash behaves as you might expect, but the role would be incompatible with the majority of other roles on Ansible Galaxy or any playbook that does not use the `merge` setting.


The solution
---

To avoid this on the Icinga2 role, we used the `combine` filter, introduced in Ansible 2.0, which combines (or merges) hashes.
By introducing a defaults hash, a customisable hash and combining the two, we can get merge behaviour while maintaining compatibility with other roles.
So our role above changes as follows.

In `vars/main.yml`:
```yaml
---
postgres_package_default:
  apt: postgresql-9.6
  yum: postgresql96-server
```

In `defaults/main.yml`:
```yaml
postgres_package_custom: {}
postgres_package: "{% raw %}{{ postgres_package_default | combine(postgres_package_custom) }}{% endraw %}"
```

And our tasks would remain the same.

As a user of the role I now edit the `postgres_package_custom` like we did previously in `group_vars/all.yml`:
```yaml
---
postgres_package_custom:
  apt: postgresql-10
```

And now our `postgres_package` variable resolves to a hash that contains the default value for yum, and our custom value for apt:
```python
{ "postgres_package" : { "apt" : "postgresql-10", "yum" : "postgresql96-server" } }
```

Justification
---

The idea behind all of this is to provide difficult-to-override defaults while still allowing users to easily override individual keys without removing the other keys.
Adding the defaults hash to `vars` rather than `defaults` means that the hash is relatively difficult to change (see [ansible variable precedence](https://docs.ansible.com/ansible/latest/user_guide/playbooks_variables.html#variable-precedence-where-should-i-put-a-variable)), while the custom hash is kept in defaults to make it very easy to change.
I personally like to have the variables separated like so:
- "default" variable that contains the default values for each key and is only used internally in the role,
- "custom" variable that is a role default that the user will use to change the defaults if necessary,
- and an "internal" variable that is the combined hash of the above, only used internally within the role.

I do accept, however, that having three variables where one previously did the job can feel messy and I do not see this as a catch-all "this will always be the best thing for your variables", but it is a useful tool I have made use of in several other roles since writing the pull request for Icinga2.
