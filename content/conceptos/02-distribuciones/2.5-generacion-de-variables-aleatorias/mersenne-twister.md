---
id: mersenne-twister
titulo: Mersenne Twister
titulo_en: Mersenne Twister
alias:
  - MT19937
  - generador de Matsumoto y Nishimura
modulo: 2
submodulo: '2.5'
orden: 3
nivel: intermedio
prerrequisitos:
  - generador-congruencial-lineal
relaciones:
  - tipo: contrasta
    id: generador-congruencial-lineal
etiquetas:
  - generador
  - periodo
  - equidistribución
  - simulación
  - operaciones de bits
resumen: >
  Generador pseudoaleatorio con un estado de 624 enteros de 32 bits y periodo 2^19937 - 1. Reparte
  uniformemente los vectores de hasta 623 valores consecutivos y es el estándar en estadística.
formula: '\text{periodo} = 2^{19937} - 1, \qquad \text{equidistribuido en } 623 \text{ dimensiones con 32 bits}'
visualizacion:
  componente: RandomLab
  parametros:
    modo: pares
    generador: mt
    ternas: true
    valores:
      n: 600
      semilla: 1
    casos:
      - nombre: 'Ternas del Mersenne Twister'
        descripcion: 'Rebanada de ternas con el valor del medio fijo: los puntos llenan el cuadrado sin planos visibles.'
        valores: {n: 600, semilla: 1}
        ternas: true
      - nombre: 'Pares consecutivos'
        descripcion: 'Con la rebanada apagada, mil pares llenan el cuadrado de manera pareja.'
        valores: {n: 1000, semilla: 5489}
        ternas: false
      - nombre: 'Semilla de referencia'
        descripcion: 'Semilla 5489, la de la implementación original: su primer valor entero es 3499211612.'
        valores: {n: 600, semilla: 5489}
referencias:
  - clave: murphy
publicado: true
---

## Intuición

Los generadores congruenciales tienen dos problemas: periodos que se agotan y vectores de valores consecutivos que caen sobre unos pocos planos. En 1997, Matsumoto y Nishimura propusieron el Mersenne Twister, que resolvió ambos de golpe y se volvió el generador por omisión en la mayoría de los lenguajes y paquetes estadísticos.

Su estado no es un solo número, sino una tabla de 624 enteros de 32 bits. En cada vuelta mezcla esos enteros con operaciones de bits muy rápidas (desplazamientos y "o exclusivos"), lo que equivale a multiplicar el estado por una matriz enorme con ceros y unos. El periodo resultante es $2^{19937} - 1$, un número primo de Mersenne con unas seis mil cifras: aunque una computadora generara mil millones de números por segundo desde el origen del universo, no recorrería una fracción visible del ciclo.

Antes de entregar cada número, el generador lo "templa" con otra mezcla de bits para que todos sus bits se repartan bien. Gracias a eso, los vectores de hasta 623 valores consecutivos se reparten de manera uniforme en el hipercubo, algo imposible para un congruencial. No es adecuado para criptografía, porque observar 624 salidas basta para reconstruir su estado, pero para simulación es excelente.

## Definición

:::definicion[Mersenne Twister MT19937]
El estado es un vector $(x_0, \dots, x_{623})$ de palabras de 32 bits. Cada nueva palabra se obtiene como
$$
x_{k+624} = x_{k+397} \oplus \big((x_k^{\text{alta}} \,|\, x_{k+1}^{\text{baja}})\,\mathbf{A}\big),
$$
donde $x^{\text{alta}}$ es el bit más significativo, $x^{\text{baja}}$ los 31 restantes, $|$ es la concatenación, $\oplus$ el o exclusivo bit a bit y $\mathbf{A}$ una matriz fija sobre $\{0, 1\}$. La salida es $u = \operatorname{temple}(x)/2^{32}$, donde el templado aplica cuatro desplazamientos con o exclusivo y máscaras.
:::

:::nota[Qué es X]
$U_n$ = el número entregado en el paso $n$, una palabra de 32 bits templada y dividida entre $2^{32}$.
:::

:::nota[Qué hace cada parámetro]
- **Semilla:** inicializa las 624 palabras del estado con una recurrencia. Si cambia, cambia la sucesión; la calidad no.
- **Número de puntos:** cuántos pares o ternas se dibujan. Si aumenta, la nube del Mersenne Twister se vuelve más pareja, sin estructuras.
:::

:::nota[Qué significa cada símbolo]
- $x_k$: palabra $k$ del estado; $624$ y $397$: tamaño del estado y desplazamiento de la recurrencia.
- $x^{\text{alta}}$, $x^{\text{baja}}$: bit superior y 31 bits inferiores.
- $|$: concatenación de bits; $\oplus$: o exclusivo; $\mathbf{A}$: matriz binaria fija.
- $\operatorname{temple}$: mezcla de bits antes de la salida.
:::

## Cómo usar la visualización

La gráfica muestra la rebanada de ternas: de cada tres valores consecutivos se conservan los que tienen el del medio entre 0.495 y 0.505, y se grafican el primero contra el tercero. Para el Mersenne Twister los puntos llenan el cuadrado; el selector permite cambiar a RANDU para ver sus líneas. El interruptor vuelve a los pares consecutivos. Los casos cargan las ternas, los pares y la semilla de referencia.

Compara el Mersenne Twister con RANDU en la rebanada y observa las líneas de RANDU. Cambia la semilla y comprueba que la calidad no cambia. Apaga la rebanada y observa que en pares los dos generadores se ven parecidos: el defecto de RANDU solo aparece en tres dimensiones.

## Ejemplo

Se comparan el Mersenne Twister y RANDU con ternas de valores consecutivos.

1. RANDU cumple $9u_n - 6u_{n+1} + u_{n+2} \in \mathbb{Z}$: en la rebanada $u_{n+1} \approx 0.5$, eso da $u_{n+2} \approx 3 - 9u_n \pmod 1$, es decir, unas cuantas rectas paralelas.
2. El Mersenne Twister con semilla 5489 produce como primeras palabras 3499211612 y 581869302, es decir, $u_1 \approx 0.8147$ y $u_2 \approx 0.1355$.
3. En la rebanada de 600 ternas del Mersenne Twister no hay rectas: los puntos se reparten por todo el cuadrado.
4. Su periodo, $2^{19937} - 1 \approx 4.3 \times 10^{6001}$, es inagotable en la práctica.
5. Su estado ocupa $624 \times 4 = 2496$ bytes, mucho más que los 4 de un congruencial, a cambio de esa calidad.

:::figura[RANDU en la misma rebanada: las ternas con el valor del medio cerca de 0.5 caen sobre rectas paralelas, mientras que el Mersenne Twister llena el cuadrado.]{componente="RandomLab"}
```yaml
modo: pares
generador: randu
ternas: true
valores:
  n: 600
  semilla: 1
```
:::

## Propiedades

- **Periodo:** $2^{19937} - 1$, un primo de Mersenne; de ahí el nombre.
- **Equidistribución:** los vectores de $k \le 623$ salidas consecutivas de 32 bits se reparten uniformemente.
- **Rapidez:** usa solo operaciones de bits y sumas, sin multiplicaciones ni divisiones costosas.
- **Predecibilidad:** a partir de 624 salidas consecutivas se reconstruye el estado completo; no sirve para criptografía.
- **Estados de arranque:** con semillas cercanas a cero o con muchos ceros en el estado, las primeras salidas pueden tardar en mezclarse; la inicialización recomendada evita ese problema.
- **Pruebas:** pasa las baterías estándar salvo algunas pruebas de complejidad lineal, que detectan su estructura binaria.

:::figura[Casos con contexto (ternas, pares, semilla de referencia): cada botón carga el número de puntos, la semilla y, en los dos primeros, enciende o apaga la rebanada.]{componente="RandomLab"}
```yaml
modo: pares
generador: mt
valores:
  n: 1000
  semilla: 5489
casos:
  - nombre: 'Ternas del Mersenne Twister'
    descripcion: 'Sin planos en la rebanada.'
    valores: {n: 600, semilla: 1}
    ternas: true
  - nombre: 'Pares consecutivos'
    descripcion: 'Cuadrado lleno de manera pareja.'
    valores: {n: 1000, semilla: 5489}
    ternas: false
  - nombre: 'Semilla de referencia'
    descripcion: 'Primer entero 3499211612.'
    valores: {n: 600, semilla: 5489}
```
:::

## Errores comunes

- **Usarlo para generar contraseñas o llaves.** Su estado se puede reconstruir a partir de sus salidas; para seguridad se usa un generador criptográfico.
- **Sembrar procesos paralelos con semillas consecutivas.** Las sucesiones no se garantizan independientes; se usan esquemas de saltos o generadores diseñados para paralelismo.
- **Pensar que un periodo enorme garantiza calidad.** El periodo es necesario, no suficiente; la equidistribución es lo que lo distingue.
- **Convertir sus enteros con divisiones descuidadas.** Dividir entre $2^{32} - 1$ en lugar de $2^{32}$ puede producir exactamente 1, fuera de $[0, 1)$.

:::figura[Pares de RANDU: en dos dimensiones el defecto no se ve; por eso un generador debe examinarse en varias dimensiones.]{componente="RandomLab"}
```yaml
modo: pares
generador: randu
valores:
  n: 1000
  semilla: 1
```
:::

## Conexiones

Supera al [[generador-congruencial-lineal]] como opción de [[generadores-de-numeros-pseudoaleatorios]] para simulación. Sus salidas pasan las [[pruebas-de-aleatoriedad]] habituales y dependen de [[semillas-y-reproducibilidad|la semilla]]. A partir de sus uniformes se generan normales con el [[metodo-de-box-muller]] o el [[algoritmo-ziggurat]]. El [[mapa-de-relaciones-entre-distribuciones]] muestra cómo, a partir de uniformes, se construyen otras distribuciones.

## Formulario

:::formula[Recurrencia de MT19937]
$$
x_{k+624} = x_{k+397} \oplus \big((x_k^{\text{alta}} \,|\, x_{k+1}^{\text{baja}})\,\mathbf{A}\big)
$$

- $x_k$: palabras de 32 bits del estado; $\oplus$: o exclusivo; $\mathbf{A}$: matriz binaria.
:::

:::formula[Salida]
$$
u = \frac{\operatorname{temple}(x)}{2^{32}} \in [0, 1)
$$

- $\operatorname{temple}$: mezcla de bits.
:::

:::formula[Periodo]
$$
2^{19937} - 1 \approx 4.3 \times 10^{6001}
$$

- Es un primo de Mersenne.
:::

:::formula[Relación de RANDU usada para comparar]
$$
9u_n - 6u_{n+1} + u_{n+2} \in \mathbb{Z}
$$

- $\mathbb{Z}$: enteros; explica sus planos en tres dimensiones.
:::
