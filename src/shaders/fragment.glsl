uniform float time;
uniform float progress;
uniform sampler2D texture1;
// uniform sampler2D texture2;
uniform vec4 resolution;

varying vec2 vUv;
varying vec4 vPosition;

float PI=3.14159265359;

float hash1(float p) {
	vec2 p2 = fract(p * vec2(5.3983, 5.4427));
    p2 += dot(p2.yx, p2.xy + vec2(21.5351, 14.3137));
	return fract(p2.x * p2.y * 95.4337);
}

void main(){
    vec2 newUV=vUv;
    // fix aspect ratio
    newUV.x *= 0.42 * (resolution.x / resolution.y);

    // make random number along Y axis and make a movement
    float stepY = (ceil(newUV.y*5.)/5.);
    float move = (time*0.01) * (0.5+hash1(stepY));

    float sides = 2.*length(vUv.x - 0.5);
    float x = vUv.x;
    float y = x + (2.*sin(x)) + abs(cos(x)); // play with function 
    float masking = step(0.91, sides);
    float shade = 10.*(sides - 0.91)*masking;
    shade = pow(shade, 5.);

    vec2 subs = vec2(0.5, (stepY - 0.1));
    newUV = (newUV - subs)*((vec2(1. + 0.1*shade, 1.+ 0.45*shade)*0.95) - 0.54*(1. - progress)) + subs;

    float direction = (mod(ceil(newUV.y*5.), 2.)==0.)? -1.1:1.1;

    newUV.x = mod(newUV.x - move + (3.*progress*direction) + hash1(stepY), 1.);
    // make multiplication of uv
    newUV = fract(newUV*5.);

    vec4 map = texture2D(texture1, newUV);
    // gl_FragColor=vec4(newUV.x-.1,newUV.y-.1,0.,1.);
    gl_FragColor = vec4(newUV, 0., 1);
    // gl_FragColor= vec4(shade);
    gl_FragColor=map;
    // gl_FragColor = vec4(vec2(direction), 0., 1.);
}