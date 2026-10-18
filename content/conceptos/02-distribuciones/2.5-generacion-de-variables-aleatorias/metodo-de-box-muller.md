---
id: metodo-de-box-muller
titulo: Método de Box-Muller
titulo_en: Box-Muller transform
alias:
  - transformación de Box-Muller
  - generación de normales
modulo: 2
submodulo: '2.5'
orden: 6
nivel: intermedio
prerrequisitos:
  - generadores-de-numeros-pseudoaleatorios
  - metodo-del-jacobiano-para-transformaciones
  - coordenadas-polares-cilindricas-y-esfericas
relaciones:
  - tipo: relacionado
    id: metodo-polar-de-marsaglia
etiquetas:
  - normal
  - transformación
  - coordenadas polares
  - simulación
  - Rayleigh
resumen: >
  Convierte dos uniformes independientes en dos normales estándar independientes: el radio se obtiene
  con sqrt(-2 log U1) y el ángulo con 2π U2.
formula: 'Z_1 = \sqrt{-2\log U_1}\,\cos(2\pi U_2), \qquad Z_2 = \sqrt{-2\log U_1}\,\sin(2\pi U_2)'
visualizacion:
  componente: RandomLab
  parametros:
    modo: box-muller
referencias:
  - clave: ross-procesos
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

La función de distribución de la normal no tiene una inversa con fórmula cerrada, así que no se puede aplicar directamente la transformada inversa para generar normales. Box y Muller encontraron en 1958 un camino lateral: en lugar de generar una normal, generar dos a la vez y verlas como un punto del plano.

Un punto con dos coordenadas normales estándar independientes tiene una distribución con simetría circular: su ángulo es uniforme entre 0 y $2\pi$, y su distancia al origen sigue una distribución de Rayleigh, cuyo cuadrado es exponencial con media 2. Las dos cosas son fáciles de generar con uniformes: el ángulo es $2\pi U_2$ y el radio es $\sqrt{-2\log U_1}$, por transformada inversa de la exponencial. Con el radio y el ángulo se recuperan las coordenadas con coseno y seno.

Así, cada par de uniformes en el cuadrado se convierte en un par de normales en el plano. Las uniformes cercanas a cero en la primera coordenada producen radios grandes, que son los raros puntos lejanos de la nube normal.

## Definición

:::teorema[Box-Muller]
Si $U_1, U_2$ son uniformes independientes en $(0, 1)$, entonces
$$
Z_1 = \sqrt{-2\log U_1}\,\cos(2\pi U_2), \qquad Z_2 = \sqrt{-2\log U_1}\,\sin(2\pi U_2)
$$
son normales estándar independientes.
:::

La demostración usa el cambio de variable $(R, \Theta) = (\sqrt{-2\log U_1}, 2\pi U_2)$: $\Theta$ es uniforme en $[0, 2\pi)$, $R^{2} = -2\log U_1$ es exponencial con media 2, y el jacobiano de pasar de coordenadas polares a cartesianas da la densidad $\frac{1}{2\pi}e^{-(z_1^{2} + z_2^{2})/2}$.

:::nota[Qué es X]
$(Z_1, Z_2)$ = el par de normales estándar independientes que se obtiene de un par de uniformes.
:::

:::nota[Qué hace cada parámetro]
- **$U_1$:** fija el radio. Si se acerca a cero, el radio $\sqrt{-2\log U_1}$ crece sin límite; si se acerca a uno, el punto cae cerca del origen.
- **$U_2$:** fija el ángulo. Si aumenta de 0 a 1, el punto gira una vuelta completa alrededor del origen.
:::

:::nota[Qué significa cada símbolo]
- $U_1$, $U_2$: uniformes independientes.
- $Z_1$, $Z_2$: normales estándar independientes.
- $R$: radio $\sqrt{-2\log U_1}$; $\Theta$: ángulo $2\pi U_2$.
- $\log$: logaritmo natural; $\cos$, $\sin$: coseno y seno.
:::

## Cómo usar la visualización

A la izquierda están los pares de uniformes en el cuadrado y a la derecha las normales que producen; el último par se resalta en ambos lados, junto con su radio (circunferencia punteada) y su ángulo. Cada paso de la reproducción transforma un par y el botón agrega 500. El panel da el último par, el radio, el ángulo, las normales y la media y la varianza de todas las normales generadas.

Reproduce paso a paso y observa que los pares con $u_1$ pequeño, a la izquierda del cuadrado, caen lejos del origen. Agrega varios miles de pares y comprueba que la media se acerca a 0 y la varianza a 1. Observa que la nube de la derecha es redonda: no hay dirección preferida.

## Ejemplo

Con $u_1 = 0.3$ y $u_2 = 0.6$:

1. Radio: $R = \sqrt{-2\log 0.3} = \sqrt{2.408} \approx 1.552$.
2. Ángulo: $\theta = 2\pi \cdot 0.6 \approx 3.770$ radianes, es decir, 216 grados.
3. $z_1 = 1.552\cos(3.770) = 1.552 \cdot (-0.809) \approx -1.255$.
4. $z_2 = 1.552\sin(3.770) = 1.552 \cdot (-0.588) \approx -0.912$.
5. El punto $(-1.255, -0.912)$ está en el tercer cuadrante, a una distancia 1.552 del origen; un radio así o mayor ocurre con probabilidad $u_1 = 0.3$, porque $P(R > r) = e^{-r^{2}/2}$.

:::figura[Pares de uniformes y normales: el último par se resalta en los dos paneles con su radio y su ángulo; con miles de pares la nube de la derecha es una normal bivariada redonda.]{componente="RandomLab"}
```yaml
modo: box-muller
```
:::

## Propiedades

- **Exactitud:** la transformación es exacta, no una aproximación.
- **Pares:** produce dos normales por cada dos uniformes; ninguna se desperdicia.
- **Radio de Rayleigh:** $R$ sigue una Rayleigh con parámetro 1 y $R^{2} \sim \chi^{2}_{2}$, una exponencial con media 2.
- **Costo:** requiere un logaritmo, una raíz y un seno y un coseno por par; el método polar evita las funciones trigonométricas.
- **Sensibilidad a generadores malos:** con un generador congruencial, las estructuras de los pares se traducen en espirales en la nube normal.
- **Otras normales:** $\mu + \sigma Z$ da $\mathcal{N}(\mu, \sigma^{2})$ y $\boldsymbol{\mu} + \mathbf{L}\mathbf{Z}$ una normal multivariada.

:::figura[Radio y cola: la distancia al origen de las normales sigue una Rayleigh con σ = 1; su cola P(R > r) = e^(-r²/2) es la misma que la de u₁ pequeño.]{componente="DistributionExplorer"}
```yaml
distribucion: rayleigh
valores:
  sigma: 1
dominio: [0, 5]
region: derecha
desde: 1.552
muestras: false
```
:::

## Errores comunes

- **Permitir $U_1 = 0$.** $\log 0$ no existe; se usa $1 - U$ cuando el generador puede devolver cero exacto.
- **Usar solo una de las dos normales.** Es correcto, pero desperdicia la mitad del trabajo.
- **Creer que $Z_1$ y $Z_2$ están relacionadas porque comparten $U_1$.** Comparten el radio, pero son independientes: la normal bivariada estándar no tiene dependencia entre coordenadas.
- **Usarla con un generador congruencial pobre.** Los defectos del generador se transforman en patrones visibles en las normales.

:::figura[Media y varianza: agrega 3000 pares y comprueba que la media de las normales queda cerca de 0 y su varianza cerca de 1.]{componente="RandomLab"}
```yaml
modo: box-muller
semilla: 11
```
:::

## Conexiones

Genera la [[distribucion-normal]] a partir de [[generadores-de-numeros-pseudoaleatorios]] mediante el [[metodo-del-jacobiano-para-transformaciones]] y las [[coordenadas-polares-cilindricas-y-esfericas|coordenadas polares]]. Su radio es una [[distribucion-de-rayleigh]] y su cuadrado una [[distribucion-exponencial]], que se genera por [[muestreo-por-transformada-inversa]]. El [[metodo-polar-de-marsaglia]] es una variante sin funciones trigonométricas y el [[algoritmo-ziggurat]] es más rápido aún. Con normales estándar se construye la [[distribucion-normal-multivariada]]. El [[mapa-de-relaciones-entre-distribuciones]] muestra estas construcciones.

## Formulario

:::formula[Transformación de Box-Muller]
$$
Z_1 = \sqrt{-2\log U_1}\,\cos(2\pi U_2), \qquad Z_2 = \sqrt{-2\log U_1}\,\sin(2\pi U_2)
$$

- $U_1$, $U_2$: uniformes independientes en $(0, 1)$; $Z_1$, $Z_2$: normales estándar independientes.
:::

:::formula[Radio y ángulo]
$$
R = \sqrt{-2\log U_1}, \quad \Theta = 2\pi U_2, \qquad P(R > r) = e^{-r^{2}/2}
$$

- $R$: radio de Rayleigh; $\Theta$: ángulo uniforme.
:::

:::formula[Densidad conjunta]
$$
f(z_1, z_2) = \frac{1}{2\pi}e^{-(z_1^{2} + z_2^{2})/2}
$$

- Producto de dos densidades normales estándar.
:::
