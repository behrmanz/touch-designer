// PIXEL SORT SHADER
// This algorithm utilizes the Odd-even sort (https://en.wikipedia.org/wiki/Odd%E2%80%93even_sort) due to parallel nature of GPU computation.
// Pixels are sorted in increasing brightness (darkest colors to the left, brightest colors to the right).

out vec4 fragColor;

uniform int Frame;
uniform float Threshold; // Pixel values below this threshold value will not move (adjusted based on personal preference).

// Calculate position of neighboring pixels. (taken from https://docs.derivative.ca/Write_a_GLSL_TOP).
vec2 input2DOffset(int texIndex, int xOffset, int yOffset)
{
	return vec2(vUV.s + (float(xOffset) * uTD2DInfos[texIndex].res.s),
				vUV.t + (float(yOffset) * uTD2DInfos[texIndex].res.t));
}

// Take the average of a pixel's RGB values.
float average(vec4 color) {
	return (color.r + color.g + color. b) / 3;
}

void main()
{
	// NOTE: vUV.st references UV Coordinate (Between 0-1).
	// NOTE: uTD2DInfos[0] refers to the first image loaded into the GLSL top.

	// Whether to look at the left or right neighboring pixel. 
	int a = int(mod(floor(vUV.s * uTD2DInfos[0].res.z), 2) * 2 - 1) * int(mod(Frame, 2) * 2 - 1);
	
	// Check for OOB.
	if(input2DOffset(0, a, 0).x < 0.0 || input2DOffset(0, a, 0).x > 1.) {
		fragColor = TDOutputSwizzle(texture(sTD2DInputs[0], vUV.st));
		return;
	}

	vec4 neighbor_pixel = texture(sTD2DInputs[0], input2DOffset(0, a, 0));
	vec4 curr_pixel = texture(sTD2DInputs[0], vUV.st);

	float neighbor_brightness = average(neighbor_pixel);
	float curr_brightness = average(curr_pixel);

	vec4 color = curr_pixel;

	// Check if the neighbor pixel was to the left or right of the current pixel. 
	if(a < 0.) {
		if(curr_brightness > Threshold && curr_brightness <= neighbor_brightness) {
			color = neighbor_pixel;
		}
	} else {
		if(neighbor_brightness > Threshold && curr_brightness > neighbor_brightness) {
			color = neighbor_pixel;
		}
	}

	// TDOutputSwizzle ensures consistent behavior between Mac and PC versions.
	fragColor = TDOutputSwizzle(color);
}
