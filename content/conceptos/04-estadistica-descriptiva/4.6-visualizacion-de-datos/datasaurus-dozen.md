---
id: datasaurus-dozen
titulo: Datasaurus dozen
titulo_en: Datasaurus dozen
alias:
  - datasaurio
  - docena del datasaurio
modulo: 4
submodulo: '4.6'
orden: 22
nivel: basico
prerrequisitos:
  - cuarteto-de-anscombe
relaciones:
  - tipo: generaliza
    id: cuarteto-de-anscombe
etiquetas:
  - visualización
  - resúmenes numéricos
  - recocido simulado
  - formas
resumen: >
  El Datasaurus dozen son doce conjuntos de puntos, uno con forma de dinosaurio, que comparten medias,
  desviaciones estándar y correlación con dos decimales. Se generan moviendo puntos poco a poco sin
  alterar esos resúmenes.
formula: '(\bar{x}, \bar{y}, s_x, s_y, r) \text{ fijos con dos decimales mientras los puntos cambian de forma}'
visualizacion:
  componente: DatasaurusDozen
  parametros:
    forma: estrella
    recorrido: true
referencias:
  - clave: tufte
publicado: true
---

## Intuición

El [[cuarteto-de-anscombe]] fue construido a mano, con cuatro conjuntos pequeños. En 2017, Justin Matejka y George Fitzmaurice mostraron que el fenómeno es mucho más general: partiendo de un conjunto de 142 puntos que dibuja un dinosaurio, pudieron transformarlo en una estrella, un círculo, una equis, líneas paralelas y muchas otras figuras, sin que cambiaran la media de $x$, la media de $y$, sus desviaciones estándar ni su correlación, todas iguales con dos decimales.

El truco es un proceso lento y paciente. En cada paso se toma un punto al azar y se mueve un poco. El movimiento se acepta solo si los cinco resúmenes, redondeados, siguen iguales y si el punto queda más cerca de la figura deseada. Miles de pasos pequeños bastan para que la nube adopte casi cualquier forma. El **Datasaurus dozen** es la colección de doce resultados; su mensaje es que una misma tabla de resúmenes es compatible con infinidad de imágenes distintas.

## Definición

:::definicion[Datasaurus dozen]
El **Datasaurus dozen** es una familia de conjuntos de puntos $\{(x_i, y_i)\}_{i=1}^{n}$ que comparten, redondeados a dos decimales,

$$
\bar{x},\quad \bar{y},\quad s_x,\quad s_y,\quad r,
$$

y cuyos diagramas de dispersión tienen formas completamente distintas. Se obtienen por **recocido simulado**: en cada iteración se propone mover un punto, $(x_i, y_i) \to (x_i + \varepsilon_1, y_i + \varepsilon_2)$ con $\varepsilon_1, \varepsilon_2$ pequeños y aleatorios, y la propuesta se acepta solo si los cinco resúmenes redondeados no cambian y, además, el punto se acerca a la figura objetivo o lo permite una temperatura que disminuye con las iteraciones.
:::

:::nota[Qué significa cada símbolo]
- $n$: número de puntos.
- $(x_i, y_i)$: coordenadas del punto $i$.
- $\bar{x}$, $\bar{y}$: medias de $x$ y de $y$.
- $s_x$, $s_y$: desviaciones estándar muestrales.
- $r$: correlación de Pearson.
- $\varepsilon_1$, $\varepsilon_2$: desplazamientos aleatorios pequeños de una propuesta.
:::

## Cómo usar la visualización

Los puntos parten del dinosaurio y se desplazan hacia la **Forma objetivo**, dibujada al fondo. El encabezado muestra los cinco resúmenes, que no cambian con dos decimales durante toda la animación, y el panel muestra el avance del recocido y la distancia media de los puntos a la figura.

Con **Recorrer todas las formas** activado, al terminar una figura se pasa a la siguiente. La forma objetivo se ajusta a las medias, desviaciones y correlación de los datos, por lo que puede verse estirada o ligeramente inclinada.

Experimentos sugeridos:

1. Vigilar los cinco números del encabezado mientras la nube cambia de forma: permanecen iguales.
2. Elegir el círculo y observar cómo la distancia media a la figura baja de varias unidades a menos de una.
3. Elegir la nube libre: los puntos se dispersan sin destino, y aun así los resúmenes no cambian.

## Ejemplo

Una iteración con números concretos. Supongamos 142 puntos con $\bar{x} = 54.26$, y el punto 17 en $(40.10, 62.30)$.

1. Se propone moverlo a $(40.45, 61.80)$.
2. La nueva media de $x$ es $\bar{x}' = \bar{x} + (40.45 - 40.10)/142 = \bar{x} + 0.0025$, que redondeada sigue siendo 54.26 si $\bar{x}$ estaba al menos 0.0025 por debajo de 54.265. Del mismo modo se recalculan $\bar{y}$, $s_x$, $s_y$ y $r$.
3. Si alguno de los cinco cambia en el segundo decimal, la propuesta se rechaza y el punto se queda donde estaba.
4. Si ninguno cambia y la nueva posición está más cerca de la figura, se acepta. Al principio, con temperatura alta, también se aceptan algunos movimientos que alejan, lo que evita quedar atrapado.

:::figura[Una sola transformación del dinosaurio al círculo: los cinco resúmenes del encabezado no cambian mientras la figura cambia por completo.]{componente="DatasaurusDozen"}
```yaml
forma: circulo
```
:::

## Propiedades

- **Infinidad de conjuntos con los mismos resúmenes:** fijar cinco números no determina la forma de 142 puntos, que tienen 284 coordenadas libres.
- **Movimientos pequeños bastan:** como cada paso cambia los resúmenes muy poco, casi cualquier figura compatible con esas medias, desviaciones y correlación es alcanzable.
- **Los resúmenes sí restringen algo:** la figura debe tener aproximadamente la misma posición, dispersión e inclinación global que los datos; por eso la figura objetivo se ajusta a ellos.

:::figura[Líneas horizontales: los mismos resúmenes con los puntos alineados en franjas.]{componente="DatasaurusDozen"}
```yaml
forma: lineas-horizontales
```
:::

:::figura[Nueve cúmulos: puntos agrupados en una rejilla de tres por tres, con las mismas medias, desviaciones y correlación.]{componente="DatasaurusDozen"}
```yaml
forma: cumulos
```
:::

## Errores comunes

- **Creer que dos conjuntos con iguales resúmenes son parecidos.** Los resúmenes describen posición, dispersión y asociación lineal global, no la forma.
- **Pensar que es un truco de redondeo.** El redondeo a dos decimales solo da margen a cada movimiento; los resúmenes de todos los conjuntos coinciden con esa precisión, que es la que se suele reportar.
- **Suponer que la correlación cercana a cero significa nube sin estructura.** El dinosaurio, la estrella y los cúmulos tienen correlación casi nula y estructura evidente.

:::figura[Correlación casi nula con estructura muy marcada: la equis tiene r cercana a cero y, sin embargo, x e y están fuertemente relacionadas en cada brazo.]{componente="DatasaurusDozen"}
```yaml
forma: equis
```
:::

## Conexiones

El Datasaurus generaliza el [[cuarteto-de-anscombe]] y refuerza la práctica de graficar con un [[diagrama-de-dispersion]] antes de calcular la [[media-aritmetica]], la [[desviacion-estandar-muestral]] o el [[coeficiente-de-correlacion-de-pearson]]. Medidas como la [[correlacion-de-distancia]] o el [[coeficiente-de-informacion-maxima]] detectan dependencias que la correlación lineal no ve.

## Formulario

:::formula[Cambio de la media al mover un punto]
$$
\bar{x}' = \bar{x} + \frac{x_i' - x_i}{n}
$$

- $\bar{x}$, $\bar{x}'$: media antes y después del movimiento.
- $x_i$, $x_i'$: coordenada del punto movido, antes y después.
- $n$: número de puntos.
:::

:::formula[Condición de aceptación]
$$
\operatorname{red}_2(\bar{x}', \bar{y}', s_x', s_y', r') = \operatorname{red}_2(\bar{x}, \bar{y}, s_x, s_y, r)
$$

- $\operatorname{red}_2$: redondeo a dos decimales de cada resumen.
- Las cantidades con apóstrofo son las del conjunto después del movimiento propuesto.
:::

:::formula[Temperatura del recocido]
$$
T_t = T_{\min} + (T_{\max} - T_{\min})\left(1 - \frac{t}{H}\right)^2
$$

- $T_t$: probabilidad de aceptar en la iteración $t$ un movimiento que aleja de la figura.
- $T_{\max}$, $T_{\min}$: temperaturas inicial y final.
- $H$: número de iteraciones en que la temperatura baja de $T_{\max}$ a $T_{\min}$.
:::
