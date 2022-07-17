function distance(vector1, vector2)
{
    let a = vector2.x - vector1.x;
    let b = vector2.y - vector1.y;

    let c = Math.abs(Math.sqrt( a*a + b*b ));

    return c
}

export {distance};