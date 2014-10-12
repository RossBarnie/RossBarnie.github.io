---
layout: post
title: "Working with web.py"
description: "My thoughts on my experience building a web application with web.py"
---

Tasked with creating a lightweight web application with a small list of requirements, my first thought was not to use Django. For starters it has a wide range of features, most of which I wouldn't need so that wouldn't help the "lightweight" nature of the app. I also disregarded Ruby on Rails as I hadn't used it before which in retrospect was a poor decision as I should have considered all possibilities. I also leaned towards python simply because I feel proficient in it. Again, a potentially foolish decision but that's by the by. In essence I decided to limit my search for web frameworks to ones I could work with in python.

While this limitation still left me with plenty to choose from, I decided on web.py as it seemed to be the most lightweight and would allow me to write my application in python, rather than to some specific framework. With that in mind I very quickly wrote a RESTful interface to my client application and it was very simple and worked. Fantastic.

Then it came to the server application. It communicated fine with the client application's REST interface and rendered HTML with web.py's template system which also allowed parameters to be passed to the website so dynamic content was possible and everything was going fine. Until Javascript.

I haven't worked much with Javascript before but web.py just cannot work with it. Javascript uses the dollar character ($) for... something I don't quite know, but importantly it is the character that indicates to the web.py template that I want to access paramaters from python. So, from my experience, you cannot access the python paramaters from within javascript. Which meant that when I tried to make a graph of data calculated within a python function, I simply couldn't, or rather I can't, as I'm still trying to find a solution.

During my attempts to find solutions for various other problems I've had with web.py I saw to my horror that half of it isn't documented, and that Aaron Swartz created it, someone I hadn't heard of until his tragic death. Needless to say, that probably explains the lack of documentation, however that doesn't help me now.

So I guess my point is that I made a few mistakes in this process. I discounted perfectly viable web frameworks and languages because of personal bias, I didn't look at the documentation before deciding on a framework and for the life of me I cannot get this graph to work.

Mistakes I will be sure to never make again.


